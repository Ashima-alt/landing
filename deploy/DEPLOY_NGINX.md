# Быстрый запуск Next.js + Nginx

## 1) Подготовка сервера (Ubuntu)

```bash
sudo apt update
sudo apt install -y nginx curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 2) Запуск приложения

```bash
cd /var/www/amir-landing
npm ci
npm run build
PORT=3000 npm run start
```

Для фона лучше использовать `pm2` или `systemd`.

### Вариант с pm2 (быстро)

```bash
sudo npm i -g pm2
cd /var/www/amir-landing
pm2 start "npm run start -- --port 3000" --name amir-landing
pm2 save
pm2 startup
```

## 3) Подключение Nginx

Скопируй шаблон:

```bash
sudo cp deploy/nginx/amir-landing.conf /etc/nginx/sites-available/amir-landing
```

Открой файл и замени `your-domain.com` на реальный домен.

```bash
sudo ln -s /etc/nginx/sites-available/amir-landing /etc/nginx/sites-enabled/amir-landing
sudo nginx -t
sudo systemctl reload nginx
```

## 4) HTTPS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 5) Обновление проекта

```bash
cd /var/www/amir-landing
git pull
npm ci
npm run build
pm2 restart amir-landing
```
