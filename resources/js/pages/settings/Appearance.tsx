import { useEffect, useState, type ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import SettingsLayout from '@/layouts/SettingsLayout';

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

export default function Appearance() {
    const [mode, setMode] = useState<Mode>('system');

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
                                className={`btn join-item capitalize ${mode === m ? 'btn-primary' : ''}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

Appearance.layout = (page: ReactNode) => <SettingsLayout>{page}</SettingsLayout>;
