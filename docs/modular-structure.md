# Modular Structure

The starter kit can install [`nwidart/laravel-modules`](https://github.com/nWidart/laravel-modules) for a feature-module layout. This is opt-in via the optional packages prompt.

## Enabling

Triggered automatically during `composer create-project` when you answer **yes** to:

> Would you like to use a modular Laravel structure?

You can also re-run it later:

```bash
php artisan artisanpack:optional-packages-command
```

## What gets installed

1. `composer require nwidart/laravel-modules`
2. `php artisan vendor:publish --provider="Nwidart\Modules\LaravelModulesServiceProvider"`
3. Updates `composer.json` to add merge-plugin config:
   ```json
   "extra": {
       "merge-plugin": {
           "include": ["Modules/*/composer.json"]
       }
   }
   ```
4. Scaffolds three default modules: `Admin`, `Auth`, `Users`
5. `composer dump-autoload`

## Adding a new module

```bash
php artisan module:make Reports
```

Creates `Modules/Reports/` with controllers, models, migrations, and a service provider already wired.

## Module structure

```
Modules/Reports/
├── Config/
├── Console/
├── Database/
│   ├── Migrations/
│   ├── Seeders/
│   └── Factories/
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   └── Requests/
├── Models/
├── Providers/
│   └── ReportsServiceProvider.php
├── Resources/
│   └── views/
├── Routes/
│   ├── web.php
│   ├── api.php
│   └── console.php
├── Tests/
├── composer.json
└── module.json
```

## Inertia pages inside a module

Modules can ship their own Inertia pages, but they live alongside the application's pages — Inertia's page resolver scans `resources/js/pages/**`. Either:

1. Put the pages under `resources/js/pages/Reports/*.tsx` and have the module's controllers render `'Reports/Index'`, etc., or
2. Add a glob to the page resolver in `resources/js/app.tsx` to also scan `Modules/*/Resources/js/pages/**`.

Option 1 is simpler and recommended.

## Why no Livewire-modules adapter?

The original Livewire starter kit installed `mhmiton/laravel-modules-livewire` to wire module-namespaced Livewire components. Since this kit uses Inertia + React, that adapter doesn't apply — Inertia controllers live in modules just like regular Laravel controllers.

## Docs

For everything else (CLI commands, configuration, testing modules, autoloading), see the official [`nwidart/laravel-modules` docs](https://docs.laravelmodules.com/).
