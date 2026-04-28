# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-04-28

### Fixed

- `package.json`, `package-lock.json`, and `vite.config.js` are no longer marked `export-ignore` in `.gitattributes`. Previously these files were stripped from `composer create-project` / `laravel new` installs, breaking `npm run build` with `ENOENT: no such file or directory, open '.../package.json'`.

## [1.0.0] - 2026-04-28

First stable release. The kit pivots the original `livewire-starter-kit` to a Laravel + Inertia.js + React stack using the ArtisanPack UI ecosystem.

### Added

- **Inertia.js v2** wired in via `inertiajs/inertia-laravel` and a `HandleInertiaRequests` middleware that shares `auth.user`, `flash`, `errors`, app `name`, and an Inspiring quote with every page.
- **React 19** + `@artisanpack-ui/react` + `@artisanpack-ui/react-laravel` + `@artisanpack-ui/tokens` + `@inertiajs/react`. Vite is configured with `@vitejs/plugin-react` and an SSR entry.
- **Inertia SSR** support — `resources/js/ssr.tsx`, `composer dev:ssr` script that builds the SSR bundle and runs `php artisan inertia:start-ssr` alongside the dev server.
- **Auth flow** ported to the standard Laravel pattern: 7 controllers (`AuthenticatedSession`, `RegisteredUser`, `PasswordResetLink`, `NewPassword`, `EmailVerificationPrompt`, `EmailVerificationNotification`, `ConfirmablePassword`), `LoginRequest` with rate limiting, named routes in `routes/auth.php`. 6 Inertia pages under `resources/js/pages/auth/`.
- **Dashboard + Settings** — `DashboardController` plus `Settings\{Profile,Password,Appearance}Controller` with `ProfileUpdateRequest` and `PasswordUpdateRequest`. `Settings\ProfileController@destroy` ports the original delete-user flow (validates `current_password`, logs out, deletes the user, redirects to `/`).
- **Layouts** — `AppLayout` (sidebar with logo / nav / user block / logout + mobile-only navbar + toast region), `AuthLayout` (centered card), `SettingsLayout` (composes AppLayout + 3-tab settings sidebar). Pages opt in via Inertia's persistent layout pattern.
- **Toast bridge** — local `InertiaToastProvider` (`resources/js/lib/InertiaToastProvider.tsx`) listens to flash shared props and surfaces them as toasts. Inlined locally to avoid an upstream root-import bug in `@artisanpack-ui/react-laravel/feedback`.
- **Wayfinder** for typed route helpers — `laravel/wayfinder` + `@laravel/vite-plugin-wayfinder`. Output (`resources/js/{actions,routes}/`) is regenerated on dev/build and during `composer create-project` via `post-create-project-cmd`. Smoke-test usage in `pages/auth/Login.tsx`.
- **ESLint + Prettier** configs mirroring the upstream `@artisanpack-ui/react` monorepo. npm scripts: `lint`, `lint:fix`, `format`, `format:check`, `type-check`.
- **Test suite** ported to Inertia (`Inertia\Testing\AssertableInertia`). 33 tests / 168 assertions covering all auth pages, settings, dashboard, welcome, and the optional-packages command.
- **GitHub workflows** (mirrored from `artisanpack-ui/media-library`):
    - `ci.yml` — Pint + ESLint + Prettier + tsc + Pest, on push/PR to `main` and `release/*`
    - `release.yml` — runs tests on `v*` tags, creates the GitHub release from the matching CHANGELOG section, then notifies Packagist
    - `auto-milestone.yml` — auto-assigns new issues to the org-shared milestone workflow
    - `claude.yml`, `claude-code-review.yml` — Claude Code wiring (disabled by default)
- **Optional packages prompt** rewritten — drops the npm prompt entirely (was Livewire-only) and removes the `mhmiton/laravel-modules-livewire` step from the modular setup; `nwidart/laravel-modules` install + default Admin/Auth/Users module scaffold remain.
- **Docs** rewritten end-to-end (`docs/*.md`) for the Inertia + React stack.

### Removed

- Livewire / Volt — `livewire/livewire`, `livewire/volt`, `artisanpack-ui/livewire-ui-components`, `App\Livewire\*`, all Volt single-file components, `app/Providers/VoltServiceProvider.php`.
- `ThemeSetupCommand` — depended on `artisanpack:generate-theme` which lived in `livewire-ui-components`. Theming will be re-wired against `@artisanpack-ui/tokens` in a future release.
- `tests/Feature/Console/InstallationTest.php` — referenced removed Livewire artifacts.

[1.0.1]: https://github.com/ArtisanPack-UI/react-starter-kit/releases/tag/v1.0.1
[1.0.0]: https://github.com/ArtisanPack-UI/react-starter-kit/releases/tag/v1.0.0

## [0.1.0-dev]

Initial scaffold copied from `livewire-starter-kit`.
