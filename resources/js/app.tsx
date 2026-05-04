import '../css/app.css';

import { ThemeProvider } from '@/context/theme-context';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { route as routeFn } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

declare global {
    var route: typeof routeFn;
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <Toaster />
                <App {...props} />
            </ThemeProvider>,
        );
    },
    progress: {
        color: 'var(--destructive)',
    },
});
window.route = routeFn;
