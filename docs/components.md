# Components

UI primitives come from [`@artisanpack-ui/react`](https://www.npmjs.com/package/@artisanpack-ui/react). The Inertia adapter lives in [`@artisanpack-ui/react-laravel`](https://www.npmjs.com/package/@artisanpack-ui/react-laravel).

## Importing

**Always use the narrowest subpath**, never the root barrel — the root re-exports `Chart`, which has `react-apexcharts` as an optional peer dep that the kit doesn't ship.

```tsx
// good
import { Button, Input, Checkbox } from '@artisanpack-ui/react/form';
import { Card, Modal } from '@artisanpack-ui/react/layout';
import { Sidebar, Navbar, Menu } from '@artisanpack-ui/react/navigation';
import { Alert, ToastProvider, useToast } from '@artisanpack-ui/react/feedback';
import { Icon, Tooltip } from '@artisanpack-ui/react/utility';
import { Avatar, Badge, Table } from '@artisanpack-ui/react/data';

// bad — pulls in apexcharts and crashes the build
import { Button } from '@artisanpack-ui/react';
```

## Layout helpers

The starter kit ships three layouts (in `resources/js/layouts/`):

- **`AppLayout`** — sidebar (logo, nav, user block + logout) + mobile-only navbar + toast region. Wraps the dashboard and all settings pages.
- **`AuthLayout`** — centered card layout for login/register/etc. Just branding + toast region.
- **`SettingsLayout`** — composes `AppLayout` + adds the 3-tab settings sidebar.

Pages opt in via Inertia's persistent layout pattern:

```tsx
import type { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';

export default function Dashboard() { /* ... */ }

Dashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
```

## Form pattern

```tsx
import { useForm } from '@inertiajs/react';
import { Button, Input } from '@artisanpack-ui/react/form';

const form = useForm({ name: '', email: '' });

<Input
    name="name"
    label="Name"
    value={form.data.name}
    error={form.errors.name}
    onChange={(e) => form.setData('name', e.target.value)}
    required
/>
<Button type="submit" color="primary" loading={form.processing}>Save</Button>
```

The `Input` accepts standard `<input>` props plus `label`, `hint`, `error`. Same shape for `Textarea`, `Select`, `Password`, etc.

## Toast pattern

`AppLayout` and `AuthLayout` both wrap their content in an `InertiaToastProvider` (defined locally at `resources/js/lib/InertiaToastProvider.tsx`). Anything you flash from a controller surfaces as a toast:

```php
return back()->with('success', 'Profile updated.');
```

Manual triggers via the `useToast` hook:

```tsx
import { useToast } from '@artisanpack-ui/react/feedback';

const toast = useToast();
toast.success('Saved!');
toast.error('Something went wrong.');
```

> **Why the local `InertiaToastProvider` and not `@artisanpack-ui/react-laravel/feedback`?** As of the adapter's `1.0.0` dist, even subpath imports from the adapter transitively trigger the root barrel of `@artisanpack-ui/react`. Until that's fixed upstream, the local copy uses the narrow subpath instead.

## Icons

```tsx
import { Icon } from '@artisanpack-ui/react/utility';

const MENU = 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5';

<Icon path={MENU} />
<Icon path={MENU} size="sm" color="primary" label="Open menu" />
```

`Icon` accepts a `path` (single SVG path string) or `children` (multi-path SVG) plus DaisyUI `color` and size presets.

## Component catalog

The full component list and prop docs are maintained upstream:

- npm: <https://www.npmjs.com/package/@artisanpack-ui/react>
- repo: <https://github.com/ArtisanPack-UI/react>

Categories (subpath imports):

| Subpath | Components |
|---|---|
| `/form` | `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Toggle`, `Radio`, `Range`, `DatePicker`, `Editor`, `File`, `Pin`, `Password`, `ColorPicker` |
| `/layout` | `Card`, `Modal`, `Drawer`, `Tabs`, `Accordion`, `Collapse`, `Divider`, `Stack`, `Grid`, `Dropdown`, `Popover` |
| `/navigation` | `Navbar`, `Sidebar`, `Menu`, `Breadcrumbs`, `Pagination`, `Steps`, `SpotlightSearch` |
| `/data` | `Table`, `Avatar`, `Badge`, `Progress`, `Stat`, `Timeline`, `Carousel`, `Code`, `Diff`, `Sparkline`, `Calendar` |
| `/feedback` | `Alert`, `Loading`, `Skeleton`, `EmptyState`, `ErrorDisplay`, `ToastProvider`, `useToast` |
| `/utility` | `Icon`, `Tooltip`, `ThemeToggle`, `Clipboard`, `Markdown` |
| `/chart` | `Chart` (requires `react-apexcharts` to be installed in your project) |
