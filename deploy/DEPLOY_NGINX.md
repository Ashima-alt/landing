# Быстрый деплой (Nginx + SSL + PM2)

Репозиторий: https://github.com/eichdmk/landing.git  
Домен по умолчанию: `valoremilano.ru`

## Перед первым деплоем

1. DNS: A-записи `valoremilano.ru` и `www` → IP VPS  
2. На VPS Ubuntu:

```bash
sudo mkdir -p /var/www
sudo chown "$USER:$USER" /var/www
cd /var/www
git clone https://github.com/eichdmk/landing.git landing
cd landing

cp deploy/deploy.env.example deploy/deploy.env
nano deploy/deploy.env   # DOMAIN, CERTBOT_EMAIL, DB_PASSWORD, REPO_URL

sudo bash deploy/setup.sh
```

3. Логин в админку — в `server/.env`:

```bash
nano /var/www/landing/server/.env
```

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=твой-пароль
COOKIE_SECURE=true
```

После правки пароля:

```bash
pm2 restart landing-api
```

Админка: `https://твой-домен/admin/`

---

## Обычный (быстрый) деплой обновлений

На сервере:

```bash
cd /var/www/landing
bash deploy/deploy.sh
```

Или с локальной машины (если настроен SSH):

```bash
ssh user@vps 'cd /var/www/landing && bash deploy/deploy.sh'
```

Скрипт: `git pull` → сборка Next + API → `pm2 restart`.

---

## Файлы

| Файл | Назначение |
|------|------------|
| [`deploy/setup.sh`](setup.sh) | Первый запуск: Node, Postgres, Nginx, PM2, **Let's Encrypt SSL** |
| [`deploy/deploy.sh`](deploy.sh) | Быстрый редеплой |
| [`deploy/production.env.example`](production.env.example) | Шаблон `server/.env` (логин/пароль админки) |
| [`deploy/deploy.env.example`](deploy.env.example) | Домен, email для SSL, пароль БД |
| [`deploy/ecosystem.config.cjs`](ecosystem.config.cjs) | PM2: `landing` + `landing-api` |
| [`deploy/nginx/amir-landing.conf`](nginx/amir-landing.conf) | Nginx (Certbot допишет HTTPS) |

---

## Важно про `.env`

- Логин/пароль админки только в **`server/.env`** (`ADMIN_USERNAME` / `ADMIN_PASSWORD`)
- При рестарте API пароль из `.env` синхронизируется в БД
- Для HTTPS: `COOKIE_SECURE=true`
- Не коммить `server/.env` и `deploy/deploy.env`

Второй пользователь (опционально):

```bash
EDITOR_USERNAME=editor
EDITOR_PASSWORD=другой-пароль
```
