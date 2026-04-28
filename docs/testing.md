# Testing

Tests are written with [Pest 3](https://pestphp.com/) and live in `tests/Unit` and `tests/Feature`. The Feature suite uses `RefreshDatabase` against an in-memory SQLite database (configured in `phpunit.xml`).

## Running

```bash
composer test                          # all tests, compact output
php artisan test --filter=login        # one test by name pattern
php artisan test tests/Feature/Auth    # one directory
```

## Inertia assertions

Page rendering is asserted with `Inertia\Testing\AssertableInertia`:

```php
use Inertia\Testing\AssertableInertia as Assert;

test('login screen can be rendered', function () {
    $this->get('/login')
        ->assertOk()
        ->assertInertia(fn (Assert $page) =>
            $page->component('auth/Login')
                 ->has('canResetPassword')
        );
});
```

Common assertions:

- `$page->component('auth/Login')` — page name
- `$page->has('quote')` — prop exists
- `$page->where('name', 'Laravel')` — exact prop value
- `$page->has('rows', 5)` — array prop length

## Action tests

For controller actions (POST/PATCH/DELETE/PUT), submit directly to the route:

```php
test('users can authenticate', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->assertAuthenticated();
});
```

## Auth helpers

```php
$this->actingAs($user)->get('/dashboard')->assertOk();
$this->assertAuthenticated();
$this->assertGuest();
```

## What's covered out of the box

- All 5 `Auth/*Test` files (login, register, password reset, password confirmation, email verification)
- `Settings/*Test` files for profile, password, and appearance
- `DashboardTest`, `ExampleTest` (welcome page)
- `Console/OptionalPackagesCommandTest` — wraps the command in `beforeEach`/`afterEach` that backs up + restores `composer.json` and `config/artisanpack.php` so the real `updateProjectName()` doesn't leak across tests

`composer test` ends with: **33 passed (168 assertions)**.

## Continuous integration

`.github/workflows/ci.yml` runs the full suite on every push and PR to `main`:

1. Install Composer + npm dependencies
2. `cp .env.example .env && php artisan key:generate`
3. `npm run build`
4. `php vendor/bin/pest tests/Unit --no-coverage`
5. `php vendor/bin/pest tests/Feature --no-coverage`

Test failures block merges to `main`.

## Writing a new test

```bash
php artisan make:test Feature/MyFeatureTest --pest
```

```php
<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('something happens', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/my-feature')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('MyFeature'));
});
```

The test extends `Tests\TestCase` automatically (via `tests/Pest.php`), which means it boots the Laravel application like any other test and auto-applies `RefreshDatabase`.
