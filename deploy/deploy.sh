#!/usr/bin/env bash
set -euo pipefail

# Быстрое обновление на уже настроенном сервере:
#   cd /var/www/landing && bash deploy/deploy.sh
#
# Что делает: git pull → build → pm2 restart
# Логин/пароль админки: server/.env (ADMIN_USERNAME / ADMIN_PASSWORD)

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="${BRANCH:-}"
if [[ -f "$ROOT_DIR/deploy/deploy.env" ]]; then
  # shellcheck disable=SC1091
  source "$ROOT_DIR/deploy/deploy.env"
  BRANCH="${BRANCH:-main}"
else
  BRANCH="${BRANCH:-main}"
fi

if [[ ! -f "$ROOT_DIR/server/.env" ]]; then
  echo "Нет server/.env — скопируй deploy/production.env.example и заполни логин/пароль:"
  echo "  cp deploy/production.env.example server/.env && nano server/.env"
  exit 1
fi

echo "==> git pull ($BRANCH)"
git fetch origin
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "==> build Next.js"
npm ci
npm run build

echo "==> build API"
cd "$ROOT_DIR/server"
npm ci
npm run build
mkdir -p uploads
cd "$ROOT_DIR"

echo "==> pm2 restart"
if pm2 describe landing >/dev/null 2>&1; then
  pm2 restart landing landing-api
else
  pm2 start "$ROOT_DIR/deploy/ecosystem.config.cjs"
fi
pm2 save

echo ""
echo "Деплой готов."
pm2 status
echo ""
echo "Админка: /admin/  (логин в server/.env → ADMIN_USERNAME / ADMIN_PASSWORD)"
