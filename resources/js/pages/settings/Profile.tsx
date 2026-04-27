import { useState, type FormEvent } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button, Input } from '@artisanpack-ui/react/form';

interface AuthUser {
    name: string;
    email: string;
    email_verified_at: string | null;
}

interface SharedProps {
    auth: { user: AuthUser };
    flash: { success?: string };
}

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
}

const NAV = [
    { href: '/settings/profile', label: 'Profile' },
    { href: '/settings/password', label: 'Password' },
    { href: '/settings/appearance', label: 'Appearance' },
];

export default function Profile({ mustVerifyEmail, status }: ProfileProps) {
    const { auth, flash } = usePage<SharedProps>().props;
    const url = typeof window !== 'undefined' ? window.location.pathname : '/settings/profile';

    const profileForm = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const deleteForm = useForm({ password: '' });
    const [deleteOpen, setDeleteOpen] = useState(false);

    function submitProfile(e: FormEvent) {
        e.preventDefault();
        profileForm.patch('/settings/profile', { preserveScroll: true });
    }

    function submitDelete(e: FormEvent) {
        e.preventDefault();
        deleteForm.delete('/settings/profile', {
            preserveScroll: true,
            onError: () => deleteForm.reset('password'),
        });
    }

    return (
        <>
            <Head title="Profile" />
            <main className="min-h-screen bg-base-200 p-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-56 shrink-0">
                        <ul className="menu bg-base-100 rounded-box shadow w-full">
                            {NAV.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className={url === item.href ? 'menu-active' : ''}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <section className="flex-1 space-y-8">
                        <div>
                            <h1 className="text-2xl font-semibold">Profile</h1>
                            <p className="text-base-content/70 text-sm">Update your name and email address.</p>
                        </div>

                        {flash.success && <div className="alert alert-success text-sm">{flash.success}</div>}

                        <form onSubmit={submitProfile} className="card bg-base-100 shadow">
                            <div className="card-body space-y-4">
                                <Input
                                    name="name"
                                    label="Name"
                                    value={profileForm.data.name}
                                    error={profileForm.errors.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                />
                                <Input
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={profileForm.data.email}
                                    error={profileForm.errors.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                />

                                {mustVerifyEmail && !auth.user.email_verified_at && (
                                    <div className="text-sm text-base-content/70">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href="/email/verification-notification"
                                            method="post"
                                            as="button"
                                            className="link link-primary"
                                        >
                                            Click here to re-send the verification email.
                                        </Link>
                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-success">
                                                A new verification link has been sent.
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="card-actions justify-end">
                                    <Button type="submit" color="primary" loading={profileForm.processing}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="card bg-base-100 shadow border border-error/30">
                            <div className="card-body space-y-3">
                                <h2 className="card-title text-error">Delete account</h2>
                                <p className="text-base-content/70 text-sm">
                                    Once your account is deleted, all of its resources and data will be
                                    permanently deleted.
                                </p>

                                {!deleteOpen ? (
                                    <div className="card-actions">
                                        <Button color="error" onClick={() => setDeleteOpen(true)}>
                                            Delete account
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={submitDelete} className="space-y-4">
                                        <Input
                                            name="password"
                                            label="Password"
                                            type="password"
                                            value={deleteForm.data.password}
                                            error={deleteForm.errors.password}
                                            onChange={(e) => deleteForm.setData('password', e.target.value)}
                                            autoFocus
                                            required
                                        />
                                        <div className="card-actions justify-end">
                                            <Button
                                                type="button"
                                                color="ghost"
                                                onClick={() => {
                                                    setDeleteOpen(false);
                                                    deleteForm.reset('password');
                                                    deleteForm.clearErrors();
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" color="error" loading={deleteForm.processing}>
                                                Permanently delete
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
