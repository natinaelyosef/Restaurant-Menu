import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Debug overlay: visit the site with `?debug=1` to see client-side errors on the page.
if (typeof window !== 'undefined') {
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.has('debug')) {
            const showError = (text) => {
                try {
                    const pre = document.createElement('pre');
                    pre.style.cssText = 'position:fixed;top:0;left:0;right:0;max-height:40vh;overflow:auto;background:#fff;color:#000;z-index:999999;padding:10px;border-bottom:2px solid #000;font-size:12px';
                    pre.textContent = text;
                    document.body.appendChild(pre);
                } catch (e) {
                    /* ignore */
                }
            };

            window.addEventListener('error', (ev) => {
                const msg = (ev && ev.message) ? ev.message : 'Unknown error';
                const stack = (ev && ev.error && ev.error.stack) ? ev.error.stack : (ev.filename ? `${ev.filename}:${ev.lineno}:${ev.colno}` : '');
                showError(`${msg}\n${stack}`);
            });

            window.addEventListener('unhandledrejection', (ev) => {
                const reason = ev && ev.reason ? (ev.reason.stack || String(ev.reason)) : 'Unhandled rejection';
                showError(`UnhandledRejection:\n${reason}`);
            });
        }

        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                window.location.reload();
            }
        });
    } catch (e) {
        // ignore
    }
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
