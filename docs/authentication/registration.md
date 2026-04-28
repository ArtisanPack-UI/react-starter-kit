# Registration

## Route

```php
Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
});
```

## Controller

`app/Http/Controllers/Auth/RegisteredUserController.php`

`store()` validates inline (no Form Request) using `Illuminate\Validation\Rules\Password::defaults()`, hashes the password, fires the `Registered` event (so verification email goes out if `MustVerifyEmail` is enabled), logs the user in, and redirects to the dashboard.

```php
$validated = $request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
    'password' => ['required', 'confirmed', Rules\Password::defaults()],
]);

$user = User::create([...]);

event(new Registered($user));
Auth::login($user);

return to_route('dashboard');
```

## Inertia page

`resources/js/pages/auth/Register.tsx`

Fields: name, email, password, password_confirmation. Wired via `Inertia\useForm`. Posts to `/register`.

## Customizing

**Add fields (e.g. company, phone):**

1. Add columns to the users table migration
2. Add validation rules to `RegisteredUserController@store`
3. Add inputs to `auth/Register.tsx`
4. Add to `User::$fillable`

**Disable registration:**

Comment out the routes in `routes/auth.php` and remove the "Sign up" link from `pages/auth/Login.tsx`.

**Tighten password rules:**

```php
'password' => ['required', 'confirmed', Rules\Password::defaults()
    ->min(12)
    ->mixedCase()
    ->numbers()
    ->symbols()
    ->uncompromised()],
```

## Tests

`tests/Feature/Auth/RegistrationTest.php` covers the rendered page + a successful registration that ends with the user authenticated.
