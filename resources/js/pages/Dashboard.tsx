import { Head, Link, usePage } from '@inertiajs/react';

interface AuthUser {
    name: string;
    email: string;
}

interface SharedProps {
    auth: { user: AuthUser | null };
}

export default function Dashboard() {
    const { auth } = usePage<SharedProps>().props;

    return (
        <>
            <Head title="Dashboard" />
            <main className="min-h-screen bg-base-200 p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold">Dashboard</h1>
                            <p className="text-base-content/70 text-sm">
                                Welcome back{auth.user ? `, ${auth.user.name}` : ''}.
                            </p>
                        </div>
                        <Link href="/settings/profile" className="btn btn-ghost btn-sm">
                            Settings
                        </Link>
                    </div>

                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="card bg-base-100 shadow aspect-video">
                                <div className="card-body items-center justify-center text-base-content/40 text-sm">
                                    Placeholder
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card bg-base-100 shadow min-h-64">
                        <div className="card-body items-center justify-center text-base-content/40">
                            Main panel placeholder
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
