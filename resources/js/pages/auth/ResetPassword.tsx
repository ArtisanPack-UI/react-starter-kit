import { Head } from '@inertiajs/react';
import { useInertiaForm } from '@artisanpack-ui/react-laravel/form';
import { Input, Button } from '@artisanpack-ui/react/form';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { form, field } = useInertiaForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/reset-password', {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    }

    return (
        <>
            <Head title="Reset password" />
            <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
                <div className="card bg-base-100 shadow-xl max-w-md w-full">
                    <div className="card-body">
                        <h1 className="card-title justify-center">Reset your password</h1>

                        <form onSubmit={submit} className="flex flex-col gap-4 mt-4">
                            <Input
                                {...field('email')}
                                label="Email address"
                                type="email"
                                autoComplete="email"
                                required
                            />
                            <Input
                                {...field('password')}
                                label="New password"
                                type="password"
                                autoComplete="new-password"
                                autoFocus
                                required
                            />
                            <Input
                                {...field('password_confirmation')}
                                label="Confirm new password"
                                type="password"
                                autoComplete="new-password"
                                required
                            />

                            <div className="flex items-center justify-end mt-2">
                                <Button type="submit" color="primary" loading={form.processing}>
                                    Reset password
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
