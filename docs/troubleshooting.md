# Troubleshooting

## `Could not resolve "react-apexcharts" imported by "@artisanpack-ui/react"`

Cause: importing from the root of `@artisanpack-ui/react` instead of a subpath. The root re-exports `Chart`, which has `react-apexcharts` as an optional peer that the kit doesn't ship.

Fix: use the narrow subpath:

```tsx
// bad
import { Button } from '@artisanpack-ui/react';

// good
import { Button } from '@artisanpack-ui/react/form';
```

If the import is in adapter code (`@artisanpack-ui/react-laravel/...`) and you can't change it, copy the helper into `resources/js/lib/` using subpath imports — see `resources/js/lib/InertiaToastProvider.tsx` for the pattern.

## `Vite manifest not found`

Cause: `npm run build` hasn't been run, or `public/build/manifest.json` is missing.

Fix:

```bash
npm install
npm run build
```

For local dev, run `npm run dev` (or `composer dev`) instead — Vite serves assets directly from the dev server.

## `vendor/autoload.php: No such file or directory`

You scaffolded the project without `composer install`. Run:

```bash
composer install
cp .env.example .env
php artisan key:generate
```

## Sidebar doesn't appear on desktop

The React `@artisanpack-ui/react` `Sidebar` only adds the `drawer-open` class when its `open` prop is `true`. For the always-visible-on-desktop pattern, pass `className="lg:drawer-open"`. The kit's `AppLayout` already does this.

## Wayfinder helpers can't be imported

If `import { something } from '@/routes'` fails, regenerate:

```bash
php artisan wayfinder:generate --no-interaction
```

Or just keep the dev server running — the Vite plugin regenerates on save.

For routes nested under a prefix (e.g. `Route::name('password.')->prefix('password')->group(...)`), helpers live in subdirectories:

```tsx
import { request as passwordRequest } from '@/routes/password';
```

## `Class "Livewire\..." not found`

Old test or page still references Livewire/Volt. The auth and settings flows were ported to Inertia controllers — search for `Volt::` or `\Livewire\\` and replace with the `$this->post(...)` / `$this->patch(...)` pattern. See [testing.md](testing.md).

## CSRF token mismatch

Inertia handles CSRF automatically. If you're hitting this:

- Make sure `SESSION_DOMAIN` in `.env` matches your `APP_URL` host
- Clear browser cookies if you switched between `localhost` and a Herd `*.test` domain

## Database errors during `composer create-project`

The `post-create-project-cmd` runs `php artisan migrate` against your default DB connection. If `.env`'s `DB_*` values can't connect, migrations fail. Either:

- Run `composer create-project --no-scripts` and set up `.env` manually before running `php artisan migrate`
- Or pre-create your database and ensure the credentials in `.env.example` work

## SSR crashes with "ECONNREFUSED 127.0.0.1:13714"

Cause: `inertia:start-ssr` isn't running, but Inertia is configured to use SSR.

Fix: either run `composer dev:ssr` (local) / start the SSR daemon (production), or disable SSR by setting `INERTIA_SSR_ENABLED=false` in `.env`.

## Dark mode doesn't persist

The Appearance page writes the user's choice to `localStorage` under `theme` and applies `data-theme` to `<html>`. Check:

- `localStorage.getItem('theme')` is set
- The `<html>` element has the matching `data-theme` attribute
- DaisyUI is configured for the chosen theme in `resources/css/app.css`

## Optional packages prompt rewrites my composer.json name

Known quirk inherited from the original kit: `OptionalPackagesCommand@updateProjectName` always sets the vendor to `laravel/`. After running it, restore your vendor manually if needed.

This is tracked as a follow-up in the v1.0.0 umbrella — feel free to send a PR.
