import type { Config } from 'ziggy-js';
import type { AuthUser, Permission, Role } from './index';

declare module '@inertiajs/core' {
    interface PageProps {
        ziggy: Config & { location: string };
        auth: {
            user: AuthUser | null;
            permissions: Permission[];
            roles: Role[];
        };
        flash?: {
            type: 'success' | 'error' | 'message';
            content: string;
        };
    }
}
