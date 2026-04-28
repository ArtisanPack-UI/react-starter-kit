# Deployment

Standard Laravel deployment with two extras: a frontend build step (Vite) and an optional SSR runner (Inertia).

## Build steps

On every deploy:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build              # client bundle (CSR)
npm run build:ssr          # client + SSR bundle

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan wayfinder:generate --no-interaction
```

`build:ssr` produces:

- `public/build/` — client assets (CSR)
- `bootstrap/ssr/ssr.js` — the Node-side SSR bundle that `inertia:start-ssr` runs

If you don't need SSR in production, skip `build:ssr` and just run `npm run build`.

## SSR in production

Run the SSR server alongside the PHP app:

```bash
php artisan inertia:start-ssr
```

By default it binds to port `13714`. The Inertia middleware (`HandleInertiaRequests`) automatically dispatches requests to that port for SSR rendering, then PHP returns the pre-rendered HTML.

Run it under a process supervisor — Supervisor, systemd, or your hosting provider's equivalent. Example systemd unit:

```ini
[Unit]
Description=Inertia SSR server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/your-app
ExecStart=/usr/bin/php artisan inertia:start-ssr
Restart=always

[Install]
WantedBy=multi-user.target
```

Restart the SSR server after every deploy:

```bash
sudo systemctl restart inertia-ssr
# or, with Supervisor:
php artisan inertia:stop-ssr   # graceful stop, supervisor restarts
```

## Environment

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
APP_KEY=base64:...

DB_CONNECTION=mysql
DB_HOST=...

SESSION_DRIVER=database     # or redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis

MAIL_MAILER=smtp
```

## Queue worker

If you use queues (the kit has a queue worker in `composer dev`), run:

```bash
php artisan queue:work --sleep=3 --tries=3
```

Under Supervisor:

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/your-app/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/laravel-worker.log
```

## Hosting platforms

### Laravel Forge / Vapor / Cloud

These platforms detect the Vite + SSR pattern and run the right commands. You'll typically:

- Set the build command to `composer install --no-dev && npm ci && npm run build:ssr`
- Add a daemon for `php artisan inertia:start-ssr`

### DigitalOcean / Fly / generic VPS

Follow the build steps above plus the systemd / Supervisor units. You'll also need:

- nginx or Caddy in front of PHP-FPM
- A long-running queue worker
- A long-running SSR process

### Without SSR

If SSR is overkill for you (say, an internal tool), skip `npm run build:ssr` and don't run `inertia:start-ssr`. Pages still render client-side from the Vite client bundle. The first paint is just slower than with SSR.

## CDN for built assets

`public/build/` is fingerprinted (Vite manifest). Push it to a CDN and configure `APP_URL` + asset host as needed.

## Health check

The kit registers a `/up` health endpoint via `bootstrap/app.php`'s `withRouting(health: '/up')`. Point your load balancer there.
