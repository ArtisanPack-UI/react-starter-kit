# User Settings

Three pages live under `/settings`, all gated by the `auth` middleware:

| Route | Controller | Page |
|---|---|---|
| `GET /settings` | (redirect) | → `/settings/profile` |
| `GET\|PATCH\|DELETE /settings/profile` | `Settings\ProfileController` | `settings/Profile` |
| `GET\|PUT /settings/password` | `Settings\PasswordController` | `settings/Password` |
| `GET /settings/appearance` | `Settings\AppearanceController` | `settings/Appearance` |

All three pages are wrapped in `SettingsLayout`, which composes `AppLayout` and adds the 3-tab settings sidebar.

## Profile

`Settings\ProfileController`:

- `edit()` — renders `settings/Profile` with `mustVerifyEmail` flag and the optional session `status`
- `update(ProfileUpdateRequest $request)` — fills the user, nulls `email_verified_at` if email changed, saves, flashes `success`
- `destroy(Request $request)` — validates the user's `current_password`, logs them out, deletes the user, redirects to `/`

`ProfileUpdateRequest` enforces a unique email (ignoring the current user's row).

The Inertia page also includes the **delete account** section — an inline confirm form behind a "Delete account" button.

## Password

`Settings\PasswordController`:

- `edit()` renders `settings/Password`
- `update(PasswordUpdateRequest $request)` validates `current_password` + `password` (via `Password::defaults()`), hashes, updates, flashes `success`

## Appearance

`Settings\AppearanceController@edit` just renders the page — there's no server-side state. The Inertia page reads/writes the user's choice to `localStorage` under `theme` and applies `data-theme` to `<html>`. Three options: light, dark, system.

## Customizing

**Add a new settings tab:**

1. Add a route in `routes/web.php` (under the `auth` middleware group):

   ```php
   Route::get('settings/notifications', [NotificationsController::class, 'edit'])
       ->name('settings.notifications');
   ```

2. Create the controller + Inertia page (`pages/settings/Notifications.tsx`) using `SettingsLayout`.

3. Add the tab to `resources/js/layouts/SettingsLayout.tsx`'s `TABS` array.

## Tests

- `tests/Feature/Settings/ProfileUpdateTest.php` — page renders, update works, email verification status handling, account deletion + wrong-password rejection
- `tests/Feature/Settings/PasswordUpdateTest.php` — successful change, wrong current password
- `tests/Feature/Settings/AppearanceTest.php` — page renders for auth users, redirects guests
