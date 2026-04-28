# Login

## Routes

```php
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
```

## Controller

`app/Http/Controllers/Auth/AuthenticatedSessionController.php`

- `create()` — `Inertia::render('auth/Login')` with `canResetPassword` and any session `status`
- `store(LoginRequest $request)` — calls `$request->authenticate()`, regenerates the session, redirects to the intended page (default `dashboard`)
- `destroy(Request $request)` — logs out, invalidates the session, redirects to `/`

## Form Request

`app/Http/Requests/Auth/LoginRequest.php`

Validates `email` + `password`. The `authenticate()` method handles rate limiting (5 attempts per minute per email + IP, then a `Lockout` event + 1-minute throttle).

## Inertia page

`resources/js/pages/auth/Login.tsx`

Fields: email, password, remember-me checkbox. Forgot-password link, sign-up link. Submits via Wayfinder's `AuthenticatedSessionController.store().url`.

## Customizing

**Change the redirect destination:**

```php
// AuthenticatedSessionController@store
return redirect()->intended(route('dashboard', absolute: false));
```

Swap `dashboard` for any named route.

**Adjust rate-limit thresholds:**

```php
// LoginRequest@ensureIsNotRateLimited
if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {  // change the 5
    return;
}
```

**Add additional fields (e.g. captcha):**

1. Add the rule to `LoginRequest::rules()`
2. Add the input to `auth/Login.tsx` and bind via `form.setData(...)`
3. Validate it inside `authenticate()` before `Auth::attempt()`

## Tests

`tests/Feature/Auth/AuthenticationTest.php` covers:

- Login screen renders the right Inertia component
- Successful login redirects to the dashboard
- Wrong password returns a session error
- Logout works
