# FAQ

## Why React + Inertia and not just React?

Inertia gives you Laravel routing, controllers, and Eloquent (i.e. server-side state) while keeping the page-rendering layer in React. You write controllers like normal Laravel and pass props to React pages — no API layer to maintain. For most Laravel apps that want a richer frontend than Blade can give, this is the smallest jump.

## How is this different from Laravel's official `laravel/react-starter-kit`?

This kit:

- Uses [`@artisanpack-ui/react`](https://www.npmjs.com/package/@artisanpack-ui/react) components instead of shadcn-style copy-pasted components
- Uses DaisyUI + Tailwind 4 (Laravel's official kit uses pure Tailwind)
- Ships [Wayfinder](https://github.com/laravel/wayfinder) for typed route helpers
- Has an interactive optional-packages prompt during install (CMS framework, hooks, media library, etc.)
- Integrates with the broader ArtisanPack UI ecosystem

If you want the official Laravel experience, use that one. If you want batteries-included with ArtisanPack UI, use this one.

## Can I switch from React to Vue?

There's a [Vue version of this kit](https://github.com/ArtisanPack-UI/vue-starter-kit). Switching mid-project means rewriting every `.tsx` to `.vue`. Backend controllers, routes, and migrations are identical between the two kits.

## Where do I customize the theme?

`resources/css/app.css` — change the DaisyUI plugin theme list. For finer control, override the CSS variables published by `@artisanpack-ui/tokens`.

## Can I drop SSR?

Yes. SSR is opt-in via `composer dev:ssr` / `npm run build:ssr` / running `php artisan inertia:start-ssr` in production. If you don't run those, the app falls back to client-side rendering. The Vite plugin still scans `resources/js/ssr.tsx` during builds, but skip building/running it if you don't need it.

## Do I have to use Wayfinder?

No. The kit demonstrates one Wayfinder usage in `pages/auth/Login.tsx` — everywhere else uses literal URL strings. You can:

- Use Wayfinder helpers everywhere (typed, refactor-safe)
- Use literal strings everywhere (zero ceremony, no codegen step)
- Mix both — there's no harm

The `wayfinder:generate` step in `post-create-project-cmd` is harmless if you don't use it.

## Where are the auth views?

There aren't separate "views" in the Blade sense — every auth screen is an Inertia page in `resources/js/pages/auth/*.tsx`. The Blade root template (`resources/views/app.blade.php`) is the only Blade file the app renders.

## How do I add a new optional package to the install prompt?

Edit `app/Console/Commands/OptionalPackagesCommand.php` and add to the `multiselect` list:

```php
$packages = multiselect(
    __('Which optional packages would you like to install?'),
    [
        'artisanpack-ui/cms-framework',
        // add yours here
        'your-vendor/your-package',
    ]
);
```

## How do I disable the toast region?

Remove the `<InertiaToastProvider>` wrapper from `AppLayout.tsx` and `AuthLayout.tsx`. Flash messages will still pass through Inertia shared props — you just won't see the toasts.

## Does this work with PHP 8.1?

No. The kit requires PHP 8.2+ (Laravel 12 requirement).

## Does this work with React 18?

The npm `dependencies` pin `react@^19.0.0` and `react-dom@^19.0.0`. Downgrade in your `package.json` to use 18 — the React adapter declares peer-dep range `^18.0.0 || ^19.0.0`.

## How do I deploy this?

See [deployment.md](deployment.md). Short version: standard Laravel deploy + `npm run build:ssr` + run `php artisan inertia:start-ssr` under a process supervisor.

## Where do I report bugs?

[github.com/ArtisanPack-UI/react-starter-kit/issues](https://github.com/ArtisanPack-UI/react-starter-kit/issues)

For component-level bugs, file against the upstream package: [github.com/ArtisanPack-UI/react/issues](https://github.com/ArtisanPack-UI/react/issues).
