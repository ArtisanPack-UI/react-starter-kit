import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';

type Mode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

function applyTheme(mode: Mode) {
    const resolved =
        mode === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            : mode;
    document.documentElement.setAttribute('data-theme', resolved);
}

const NAV = [
    { href: '/settings/profile', label: 'Profile' },
    { href: '/settings/password', label: 'Password' },
    { href: '/settings/appearance', label: 'Appearance' },
];

export default function Appearance() {
    const [mode, setMode] = useState<Mode>('system');
    const url = typeof window !== 'undefined' ? window.location.pathname : '/settings/appearance';

    useEffect(() => {
        const saved = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? 'system';
        setMode(saved);
        applyTheme(saved);
    }, []);

    function pick(next: Mode) {
        setMode(next);
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    }

    return (
        <>
            <Head title="Appearance" />
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

                    <section className="flex-1 space-y-6">
                        <div>
                            <h1 className="text-2xl font-semibold">Appearance</h1>
                            <p className="text-base-content/70 text-sm">
                                Choose how the app looks to you. Saved on this device only.
                            </p>
                        </div>

                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <div className="join">
                                    {(['light', 'dark', 'system'] as Mode[]).map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => pick(m)}
                                            className={`btn join-item capitalize ${
                                                mode === m ? 'btn-primary' : ''
                                            }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
