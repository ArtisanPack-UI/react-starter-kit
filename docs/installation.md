# Installation

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js 20+ and npm
- A database (SQLite works out of the box for development)

## Create a new project

```bash
composer create-project artisanpack-ui/react-starter-kit your-project-name
cd your-project-name
```

The `post-create-project-cmd` chain runs automatically:

1. `php artisan key:generate` — sets `APP_KEY` in `.env`
2. `php artisan migrate` — runs the initial migrations
3. `php artisan artisanpack:optional-packages-command` — interactive prompt to install extras (see below)
4. A second `php artisan migrate` to pick up any migrations published by the optional packages
5. `php artisan wayfinder:generate` — generates `resources/js/{actions,routes}/` for typed route helpers

## Optional packages prompt

You'll be asked which optional ArtisanPack UI packages you want:

| Package | Purpose |
|---|---|
| `artisanpack-ui/cms-framework` | Content / page management primitives |
| `artisanpack-ui/code-style` | PHP_CodeSniffer ruleset |
| `artisanpack-ui/code-style-pint` | Laravel Pint configuration |
| `artisanpack-ui/icons` | Extensible icon registration |
| `artisanpack-ui/hooks` | WordPress-style actions and filters |
| `artisanpack-ui/media-library` | Media upload + image processing |

Then:

> Would you like to use a modular Laravel structure?

Pick yes to install `nwidart/laravel-modules` and scaffold default `Admin`, `Auth`, and `Users` modules. See [modular-structure.md](modular-structure.md).

You can re-run the prompt later: `php artisan artisanpack:optional-packages-command`.

## Run the dev server

```bash
composer dev
```

Runs server, queue worker, log tailer (Pail), and the Vite dev server concurrently. Visit `http://localhost:8000` (or your Herd URL).

To run with the SSR server:

```bash
composer dev:ssr
```

This builds the SSR bundle first and adds `php artisan inertia:start-ssr` to the concurrent processes.

## Database setup

The project ships with `DB_CONNECTION=mysql` in `.env.example`. For local dev, switch to SQLite:

```bash
# .env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
```

```bash
touch database/database.sqlite
php artisan migrate
```
