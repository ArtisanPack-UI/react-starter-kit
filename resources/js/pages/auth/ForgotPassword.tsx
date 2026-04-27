import { Head, Link } from '@inertiajs/react';
import { useInertiaForm } from '@artisanpack-ui/react-laravel/form';
import { Input, Button } from '@artisanpack-ui/react/form';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { form, field } = useInertiaForm({ email: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/forgot-password');
    }

    return (
        <>
            <Head title="Forgot password" />
            <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
                <div className="card bg-base-100 shadow-xl max-w-md w-full">
                    <div className="card-body">
                        <h1 className="card-title justify-center">Forgot your password?</h1>
                        <p className="text-sm text-base-content/70 text-center">
                            Enter your email and we&apos;ll send you a link to reset it.
                        </p>

                        {status && <div className="alert alert-success text-sm mt-2">{status}</div>}

                        <form onSubmit={submit} className="flex flex-col gap-4 mt-4">
                            <Input
                                {...field('email')}
                                label="Email address"
                                type="email"
                                autoComplete="email"
                                autoFocus
                                required
                            />

                            <div className="flex items-center justify-between mt-2">
                                <Link href={'/login'} className="link link-primary text-sm">
                                    Back to login
                                </Link>
                                <Button type="submit" color="primary" loading={form.processing}>
                                    Email password reset link
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
