# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - Unreleased

### Added

- Non-interactive fallback for `artisanpack:optional-packages-command`: when run under `laravel new` (which passes `--no-interaction`), the command now re-attaches to `/dev/tty` where available so the prompts actually appear, and falls back to a clear "run this manually after install" notice when no terminal is reachable.
- Expanded the optional-packages prompt to include every current ArtisanPack UI package that doesn't hard-depend on Livewire (ai, bing-places, bookings, cms-framework, google, google-business-profile, hooks, icons, security, visual-editor, plus the code-style dev tools), grouped by category in each label.
- `phpunit/phpunit ^12.0` and `pestphp/pest-plugin-laravel ^4.0` explicitly required to match the L13 test toolchain.
- `config/cache.php` now declares an empty `serializable_classes` allowlist to match L13's hardened deserialization default.
- `config/session.php` now defaults `serialization` to `json` (via `SESSION_SERIALIZATION`). **Upgrading applications:** switching from `php` to `json` invalidates existing session data — plan a rollout accordingly.

### Changed

- **Breaking:** minimum PHP is now **8.3** (dropped 8.2).
- **Breaking:** upgraded to **Laravel 13** (`laravel/framework ^13.0`).
- Upgraded companion dependencies to their L13 majors: `laravel/tinker ^3.0`, `laravel/boost ^2.0`, `pestphp/pest ^4.0`, `pestphp/pest-plugin-laravel ^4.0`.
- Bumped ArtisanPack UI dependencies to their L13-ready majors: `artisanpack-ui/accessibility ^2.3.0`, `artisanpack-ui/core ^1.3.0`, `artisanpack-ui/security ^2.1.0` (major bump).
- `artisanpack-ui/media-library` intentionally omitted from the optional-packages prompt: it currently hard-depends on `artisanpack-ui/livewire-ui-components` and `livewire/livewire`, which would pull the Livewire stack into an Inertia + React app. Users who want it can `composer require` it manually.
- CI test job now runs a PHP matrix — 8.3, 8.4, 8.5 — instead of a single version.

### Fixed

- `config/database.php` now prefers `Pdo\Mysql::ATTR_SSL_CA` when available (PHP 8.5+) and falls back to `PDO::MYSQL_ATTR_SSL_CA` on 8.3/8.4, silencing the PHP 8.5 deprecation notice on the MySQL and MariaDB connections.
- `artisanpack:optional-packages-command` now installs `artisanpack-ui/code-style` and `artisanpack-ui/code-style-pint` as `require-dev` dependencies via a partitioned `composer require --dev` call, so they don't leak into production installs.
- TTY reachability probe `fopen`s `/dev/tty` for read + write instead of relying on `is_readable()`/`is_writable()`, which pass on Linux even when the process has no controlling terminal (`open()` then fails with ENXIO). A failed `rerunWithTty()` now routes back through the "skipping" notice fallback instead of returning the shell's non-zero status.

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
