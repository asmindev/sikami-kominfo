import type { AuthUser, Permission, Role } from '@/lib/permissions';
import type { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    roles?: { name: string }[];
}

export type { AuthUser, Permission, Role } from '@/lib/permissions';

export interface Employee {
    id: number;
    user_id: number;
    nip: string;
    position: string;
    created_at: string;
    updated_at: string;
    user: User;
}

export type AhpDomain = 'governance' | 'risk_management' | 'framework' | 'asset_management' | 'technology';

export interface Question {
    id: number;
    domain: AhpDomain;
    indicator: string;
    question_text: string;
    order: number;
    created_at: string;
    updated_at: string;
}

export type KamiCategory = 'not_eligible' | 'basic_framework' | 'good_enough' | 'good';

export interface PageProps {
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
