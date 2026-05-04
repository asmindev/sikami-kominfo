/**
 * Hook for accessing permission system within React components
 * Provides permission checking and role information
 */

import type { AuthUser, Permission, Role } from '@/lib/permissions';
import { canAll as canAllHelper, can as canHelper, hasRole as hasRoleHelper } from '@/lib/permissions';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

/**
 * Permission system hook
 * Returns user permissions, roles, and permission checking utilities
 *
 * @returns Object with permission checks and user info
 *
 * @example
 * const { can, user } = usePermission();
 * if (can('dashboard.view')) {
 *   // render dashboard
 * }
 */
export function usePermission() {
    const { props } = usePage<PageProps>();
    const authUser = props.auth?.user as AuthUser | null;
    const userPermissions = (props.auth?.permissions ?? []) as Permission[];
    const userRoles = (props.auth?.roles ?? []) as Role[];

    /**
     * Check if user has ANY of the given permission(s)
     * @param permission - Single permission or array of permissions
     * @returns true if user has at least one of the permissions
     */
    const can = (permission: Permission | Permission[]): boolean => {
        if (!authUser) return false;
        return canHelper(permission, userPermissions);
    };

    /**
     * Check if user has ALL of the given permissions
     * @param permissions - Array of required permissions
     * @returns true if user has all the permissions
     */
    const canAll = (permissions: Permission[]): boolean => {
        if (!authUser) return false;
        return canAllHelper(permissions, userPermissions);
    };

    /**
     * Check if user has ANY of the given role(s)
     * Utility function for role checking (not used for access gates)
     * @param role - Single role or array of roles
     * @returns true if user has at least one of the roles
     *
     * @note Always use can/canAll for authorization decisions.
     * This is for informational purposes only.
     */
    const hasRole = (role: Role | Role[]): boolean => {
        if (!authUser) return false;
        return hasRoleHelper(role, userRoles);
    };

    return {
        /** Check if user has ANY of the given permission(s) */
        can,
        /** Check if user has ALL of the given permissions */
        canAll,
        /** Check if user has ANY of the given role(s) - utility only */
        hasRole,
        /** Authenticated user object, or null if not authenticated */
        user: authUser,
        /** Array of user permissions */
        permissions: userPermissions,
        /** Array of user roles */
        roles: userRoles,
    };
}
