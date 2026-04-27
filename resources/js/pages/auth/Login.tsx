import { Head, Link } from '@inertiajs/react';
import { useInertiaForm } from '@artisanpack-ui/react-laravel/form';
import { Input, Button, Checkbox } from '@artisanpack-ui/react/form';

interface LoginProps {
    canResetPassword: boolean;
    status?: string;
}

export default function Login({ canResetPassword, status }: LoginProps) {
    const { form, field, checkbox } = useInertiaForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/login', {
            onFinish: () => form.reset('password'),
        });
    }

    return (
        <>
            <Head title="Log in" />
            <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
                <div className="card bg-base-100 shadow-xl max-w-md w-full">
                    <div className="card-body">
                        <h1 className="card-title justify-center">Log in to your account</h1>
                        {status && <div className="alert alert-info text-sm">{status}</div>}

                        <form onSubmit={submit} className="flex flex-col gap-4 mt-4">
                            <Input
                                {...field('email')}
                                label="Email address"
                                type="email"
                                autoComplete="email"
                                autoFocus
                                required
                            />

                            <Input
                                {...field('password')}
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                required
                            />

                            <Checkbox {...checkbox('remember')} label="Remember me" />

                            <div className="flex items-center justify-between mt-2">
                                {canResetPassword && (
                                    <Link
                                        href={'/forgot-password'}
                                        className="link link-primary text-sm"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                                <Button type="submit" color="primary" loading={form.processing}>
                                    Log in
                                </Button>
                            </div>
                        </form>

                        <div className="text-center text-sm mt-4 text-base-content/70">
                            Don&apos;t have an account?{' '}
                            <Link href={'/register'} className="link link-primary">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
