#!/usr/bin/env bash
set -euo pipefail

# Первый деплой на чистый Ubuntu VPS:
#   sudo bash deploy/setup.sh
#
# Перед запуском заполни:
#   deploy/deploy.env
#   (скрипт создаст server/.env из production.env.example, если его нет)

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_DIR="$ROOT_DIR/deploy"
ENV_FILE="$DEPLOY_DIR/deploy.env"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Запусти с sudo: sudo bash deploy/setup.sh"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Нет $ENV_FILE"
  echo "Скопируй: cp deploy/deploy.env.example deploy/deploy.env && nano deploy/deploy.env"
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

DOMAIN="${DOMAIN:?DOMAIN required}"
WWW_DOMAIN="${WWW_DOMAIN:-www.$DOMAIN}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:?CERTBOT_EMAIL required}"
APP_DIR="${APP_DIR:-/var/www/landing}"
REPO_URL="${REPO_URL:?REPO_URL required}"
BRANCH="${BRANCH:-main}"
DB_PASSWORD="${DB_PASSWORD:?DB_PASSWORD required}"
APP_USER="${SUDO_USER:-$USER}"

echo "==> 1. Пакеты"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y nginx git curl ufw postgresql postgresql-contrib \
  certbot python3-certbot-nginx build-essential

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
  apt-get install -y nodejs
fi

npm install -g pm2

echo "==> 2. Firewall"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable || true

echo "==> 3. PostgreSQL"
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'landing') THEN
    CREATE ROLE landing LOGIN PASSWORD '${DB_PASSWORD}';
  ELSE
    ALTER ROLE landing WITH PASSWORD '${DB_PASSWORD}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE landing OWNER landing'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'landing')\gexec
GRANT ALL PRIVILEGES ON DATABASE landing TO landing;
SQL

echo "==> 4. Код"
mkdir -p "$(dirname "$APP_DIR")"
if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone -b "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  cd "$APP_DIR"
  git fetch origin
  git checkout "$BRANCH"
  git pull --ff-only origin "$BRANCH"
fi
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

echo "==> 5. Env"
if [[ ! -f "$APP_DIR/server/.env" ]]; then
  cp "$APP_DIR/deploy/production.env.example" "$APP_DIR/server/.env"
  COOKIE_SECRET="$(openssl rand -hex 32)"
  sed -i "s|CHANGE_DB_PASSWORD|${DB_PASSWORD}|g" "$APP_DIR/server/.env"
  sed -i "s|CHANGE_TO_LONG_RANDOM_STRING|${COOKIE_SECRET}|g" "$APP_DIR/server/.env"
  sed -i "s|CHANGE_ADMIN_PASSWORD|$(openssl rand -base64 12 | tr -d '=+/')|g" "$APP_DIR/server/.env"
  sed -i "s|CHANGE_EDITOR_PASSWORD|$(openssl rand -base64 12 | tr -d '=+/')|g" "$APP_DIR/server/.env"
  chown "$APP_USER:$APP_USER" "$APP_DIR/server/.env"
  chmod 600 "$APP_DIR/server/.env"
  echo "Создан $APP_DIR/server/.env — ОБЯЗАТЕЛЬНО поменяй ADMIN_PASSWORD:"
  echo "  nano $APP_DIR/server/.env"
fi

cat > "$APP_DIR/.env.local" <<EOF
NEXT_PUBLIC_API_URL=
API_ORIGIN=http://127.0.0.1:4000
EOF
chown "$APP_USER:$APP_USER" "$APP_DIR/.env.local"

echo "==> 6. Сборка"
cd "$APP_DIR"
sudo -u "$APP_USER" npm ci
sudo -u "$APP_USER" npm run build
cd "$APP_DIR/server"
sudo -u "$APP_USER" npm ci
sudo -u "$APP_USER" npm run build
sudo -u "$APP_USER" mkdir -p uploads

echo "==> 7. Nginx (HTTP)"
cp "$APP_DIR/deploy/nginx/amir-landing.conf" /etc/nginx/sites-available/landing
sed -i "s/valoremilano.ru/${DOMAIN}/g" /etc/nginx/sites-available/landing
sed -i "s/www.valoremilano.ru/${WWW_DOMAIN}/g" /etc/nginx/sites-available/landing
ln -sfn /etc/nginx/sites-available/landing /etc/nginx/sites-enabled/landing
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> 8. PM2"
cd "$APP_DIR"
sudo -u "$APP_USER" pm2 delete landing landing-api >/dev/null 2>&1 || true
sudo -u "$APP_USER" pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"
sudo -u "$APP_USER" pm2 save
env PATH="$PATH" pm2 startup systemd -u "$APP_USER" --hp "$(eval echo ~"$APP_USER")" | tail -n 1 | bash || true

echo "==> 9. SSL (Let's Encrypt)"
certbot --nginx -d "$DOMAIN" -d "$WWW_DOMAIN" \
  --non-interactive --agree-tos -m "$CERTBOT_EMAIL" --redirect

systemctl reload nginx

echo ""
echo "Готово."
echo "  Сайт:    https://${DOMAIN}"
echo "  Админка: https://${DOMAIN}/admin/"
echo "  Логин/пароль: nano ${APP_DIR}/server/.env  (ADMIN_USERNAME / ADMIN_PASSWORD)"
echo ""
echo "Дальше быстрый деплой обновлений:"
echo "  cd ${APP_DIR} && bash deploy/deploy.sh"
