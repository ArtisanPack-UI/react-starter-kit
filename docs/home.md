# React Starter Kit

A Laravel + React + Inertia.js starter kit using [ArtisanPack UI](https://github.com/ArtisanPack-UI) components.

## Stack

| Layer | Tool |
|---|---|
| Backend | Laravel 12, PHP 8.2+ |
| Page integration | Inertia.js v2 |
| UI framework | React 19 |
| Styling | Tailwind CSS 4 + DaisyUI 5 |
| Components | `@artisanpack-ui/react` + `@artisanpack-ui/react-laravel` adapter |
| Tokens / theme | `@artisanpack-ui/tokens` |
| Typed routes | Laravel Wayfinder |
| Tests | Pest 3 |

## What you get out of the box

- Full auth flow: login, register, forgot/reset password, email verification, password confirmation
- Settings: profile, password, appearance (light/dark/system theme)
- Account deletion with password confirmation
- Shared `AppLayout` (Sidebar + mobile Navbar + toast region) and `AuthLayout`
- SSR enabled (`composer dev:ssr` to run with the SSR server)
- CI workflow that runs `composer test` on push and PR

## Docs

| Topic | |
|---|---|
| Install + first run | [installation.md](installation.md) |
| Walkthrough | [getting-started.md](getting-started.md) |
| Configuration | [configuration.md](configuration.md) |
| Authentication | [authentication.md](authentication.md) |
| UI components | [components.md](components.md) |
| Modular structure | [modular-structure.md](modular-structure.md) |
| Testing | [testing.md](testing.md) |
| Deployment | [deployment.md](deployment.md) |
| Troubleshooting | [troubleshooting.md](troubleshooting.md) |
| FAQ | [faq.md](faq.md) |
| Contributing | [contributing.md](contributing.md) |
