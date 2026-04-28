# Authentication

The kit ships a complete auth flow built on the standard Laravel pattern: controllers + Form Requests + Inertia pages. No external auth packages.

## What's included

| Flow | Route(s) | Controller | Page |
|---|---|---|---|
| Login | `GET\|POST /login` | `AuthenticatedSessionController` | `auth/Login` |
| Register | `GET\|POST /register` | `RegisteredUserController` | `auth/Register` |
| Forgot password | `GET\|POST /forgot-password` | `PasswordResetLinkController` | `auth/ForgotPassword` |
| Reset password | `GET\|POST /reset-password` | `NewPasswordController` | `auth/ResetPassword` |
| Verify email (prompt) | `GET /verify-email` | `EmailVerificationPromptController` | `auth/VerifyEmail` |
| Verify email (link) | `GET /verify-email/{id}/{hash}` | `VerifyEmailController` | — (redirect) |
| Resend verification | `POST /email/verification-notification` | `EmailVerificationNotificationController` | — |
| Confirm password | `GET\|POST /confirm-password` | `ConfirmablePasswordController` | `auth/ConfirmPassword` |
| Logout | `POST /logout` | `AuthenticatedSessionController@destroy` | — |

All routes live in `routes/auth.php`, included from `routes/web.php`.

## Controllers + Form Requests

The login flow uses a dedicated `LoginRequest`:

```php
// app/Http/Requests/Auth/LoginRequest.php
public function rules(): array
{
    return [
        'email' => ['required', 'string', 'email'],
        'password' => ['required', 'string'],
    ];
}

public function authenticate(): void
{
    $this->ensureIsNotRateLimited();

    if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
        RateLimiter::hit($this->throttleKey());
        throw ValidationException::withMessages([
            'email' => trans('auth.failed'),
        ]);
    }

    RateLimiter::clear($this->throttleKey());
}
```

5 failed attempts within 1 minute trigger a lockout (rate limited per email + IP).

Other actions (register, password reset, etc.) validate inline in the controller — see the source files.

## Inertia pages

Each page lives at `resources/js/pages/auth/*.tsx` and uses Inertia's `useForm` plus `Input`, `Button`, `Checkbox` from `@artisanpack-ui/react/form`:

```tsx
import { useForm } from '@inertiajs/react';
import { Button, Input } from '@artisanpack-ui/react/form';
import AuthLayout from '@/layouts/AuthLayout';
import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';

export default function Login() {
    const form = useForm({ email: '', password: '', remember: false });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(AuthenticatedSessionController.store().url, {
            onFinish: () => form.reset('password'),
        });
    }

    return (/* ... form markup ... */);
}

Login.layout = (page) => <AuthLayout>{page}</AuthLayout>;
```

The `AuthLayout` provides the centered card layout, branding, and toast region.

## Email verification

The `User` model does **not** implement `MustVerifyEmail` by default. To require verification:

1. Add `implements MustVerifyEmail` to `App\Models\User`
2. Use the `verified` middleware on routes that require a verified email (the dashboard already does)

## Logout

Triggered by a `POST /logout`. From a React component:

```tsx
import { router } from '@inertiajs/react';

<button onClick={() => router.post('/logout')}>Log out</button>
```

The `AppLayout` sidebar's user block already wires this up.

## Subpages

- [Login](authentication/login.md)
- [Registration](authentication/registration.md)
- [User settings](authentication/user-settings.md)
