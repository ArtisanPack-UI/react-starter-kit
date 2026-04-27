import { Head, Link } from '@inertiajs/react';
import { useInertiaForm } from '@artisanpack-ui/react-laravel/form';
import { Input, Button } from '@artisanpack-ui/react/form';

export default function Register() {
    const { form, field } = useInertiaForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/register', {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    }

    return (
        <>
            <Head title="Register" />
            <main className="min-h-screen bg-base-200 flex items-center justify-center p-6">
                <div className="card bg-base-100 shadow-xl max-w-md w-full">
                    <div className="card-body">
                        <h1 className="card-title justify-center">Create an account</h1>

                        <form onSubmit={submit} className="flex flex-col gap-4 mt-4">
                            <Input {...field('name')} label="Name" autoComplete="name" autoFocus required />
                            <Input {...field('email')} label="Email address" type="email" autoComplete="email" required />
                            <Input {...field('password')} label="Password" type="password" autoComplete="new-password" required />
                            <Input
                                {...field('password_confirmation')}
                                label="Confirm password"
                                type="password"
                                autoComplete="new-password"
                                required
                            />

                            <div className="flex items-center justify-end mt-2">
                                <Button type="submit" color="primary" loading={form.processing}>
                                    Create account
                                </Button>
                            </div>
                        </form>

                        <div className="text-center text-sm mt-4 text-base-content/70">
                            Already registered?{' '}
                            <Link href={'/login'} className="link link-primary">
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
