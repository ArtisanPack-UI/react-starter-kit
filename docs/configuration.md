# Configuration

## Environment

Standard Laravel `.env`. Keys you'll most often touch:

```
APP_NAME="Your App"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql        # or sqlite (recommended for local)
DB_HOST=127.0.0.1
DB_DATABASE=laravel

MAIL_MAILER=log            # send to storage/logs/laravel.log in dev
```

`config/*.php` reads from `.env` via `env()`. Per Laravel convention, `env()` should only be called inside `config/`. Anywhere else, use `config('key')`.

## Inertia

The kit ships an `App\Http\Middleware\HandleInertiaRequests` middleware appended to the `web` group in `bootstrap/app.php`. It shares the following props with every page:

```php
return [
    ...parent::share($request),
    'name' => config('app.name'),
    'quote' => ['message' => ..., 'author' => ...],   // an Inspiring quote
    'auth' => [
        'user' => $request->user(),
    ],
    'flash' => [
        'success' => fn () => $request->session()->get('success'),
        'error'   => fn () => $request->session()->get('error'),
        'info'    => fn () => $request->session()->get('info'),
        'warning' => fn () => $request->session()->get('warning'),
    ],
];
```

Pages access these via `usePage<SharedProps>().props`.

The Inertia root template is `resources/views/app.blade.php` — set in the middleware's `$rootView`.

## Tailwind + DaisyUI

`resources/css/app.css` imports Tailwind, the ArtisanPack UI tokens CSS, and registers DaisyUI:

```css
@import 'tailwindcss';
@import '@artisanpack-ui/tokens/css';

@source '../views';
@source '../js';
@source '../../node_modules/@artisanpack-ui/react/dist';
@source '../../node_modules/@artisanpack-ui/react-laravel/dist';

@plugin "daisyui" {
    themes: light --default, dark --prefersdark;
}
```

The `@source` directives tell Tailwind which files to scan for classes. The `node_modules/@artisanpack-ui/...` entries are required so DaisyUI utility classes used inside the React components are picked up.

## Wayfinder

[Laravel Wayfinder](https://github.com/laravel/wayfinder) generates TypeScript helpers from your route definitions. After any route change:

```bash
php artisan wayfinder:generate
```

Or rely on the Vite plugin that regenerates on dev/build:

```js
// vite.config.js
import { wayfinder } from '@laravel/vite-plugin-wayfinder';

plugins: [
    laravel({ /* ... */ }),
    react(),
    tailwindcss(),
    wayfinder({ formVariants: true }),
]
```

Generated output lands in:

- `resources/js/routes/` — named-route helpers (e.g. `register()`, `password.request()`)
- `resources/js/actions/` — controller-action helpers (e.g. `AuthenticatedSessionController.store()`)
- `resources/js/wayfinder/` — runtime utilities

These are `gitignored` — they're regenerated on every build / dev boot / `composer create-project`.

Use them like:

```tsx
import { register } from '@/routes';
import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';

<Link href={register().url}>Sign up</Link>
form.post(AuthenticatedSessionController.store().url);
```

## Vite

`vite.config.js` registers four plugins: `laravel-vite-plugin`, `@vitejs/plugin-react`, `@tailwindcss/vite`, and `@laravel/vite-plugin-wayfinder`. SSR is configured via the `ssr:` option:

```js
laravel({
    input: ['resources/css/app.css', 'resources/js/app.tsx'],
    ssr: 'resources/js/ssr.tsx',
    refresh: true,
}),
```

## Theme

Edit `resources/css/app.css` to switch DaisyUI themes:

```css
@plugin "daisyui" {
    themes: corporate --default, business --prefersdark;
}
```

See [daisyui.com/themes](https://daisyui.com/themes) for the full list.

For finer control over colors, override the CSS variables published by `@artisanpack-ui/tokens` — see the tokens package README.
