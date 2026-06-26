import axios from 'axios';

// ── Configure Axios defaults (CSRF + credentials) ──────────────────────────
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// ── Laravel Echo + Pusher (client-side only — skip during SSR) ─────────────
// pusher-js references `window` internally, so we must avoid importing it
// at module-evaluation time during SSR (Node.js).
if (typeof window !== 'undefined') {
    void Promise.all([import('pusher-js'), import('laravel-echo')]).then(([{ default: Pusher }, { default: Echo }]) => {
        (window as any).Pusher = Pusher;

        (window as any).Echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: window.location.hostname,
            wsPort: import.meta.env.VITE_REVERB_PORT ? parseInt(import.meta.env.VITE_REVERB_PORT) : 80,
            wssPort: import.meta.env.VITE_REVERB_PORT ? parseInt(import.meta.env.VITE_REVERB_PORT) : 443,
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        });
    });
}
