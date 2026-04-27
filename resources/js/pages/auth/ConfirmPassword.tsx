import { Head } from '@inertiajs/react';
import { useInertiaForm } from '@artisanpack-ui/react-laravel/form';
import { Input, Button } from '@artisanpack-ui/react/form';

export default function ConfirmPassword() {
    const { form, field } = useInertiaForm({ password: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/confirm-password', {
            onFinish: () => form.reset('password'),
        });
    }

    return (
        <>
            <Head title="Confirm password" />
            <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
                <div className="card bg-base-100 shadow-xl max-w-md w-full">
                    <div className="card-body">
                        <h1 className="card-title justify-center">Confirm your password</h1>
                        <p className="text-sm text-base-content/70 text-center">
                            This is a secure area. Please confirm your password before continuing.
                        </p>

                        <form onSubmit={submit} className="flex flex-col gap-4 mt-4">
                            <Input
                                {...field('password')}
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                            />

                            <div className="flex items-center justify-end mt-2">
                                <Button type="submit" color="primary" loading={form.processing}>
                                    Confirm
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
