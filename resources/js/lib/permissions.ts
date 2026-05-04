/**
 * Permission system for SIKAMI-AHP
 * Pure utility functions for permission checking (no React/Inertia dependencies)
 */

/**
 * Union type of all available permissions in the application
 * Format: {resource}.{action}
 *
 * Dashboard
 * - dashboard.view
 *
 * Leader Management
 * - leader.view | leader.create | leader.edit | leader.delete
 *
 * Question Management
 * - question.view | question.create | question.edit | question.delete
 *
 * AHP
 * - ahp-pairwise.view | ahp-pairwise.create
 * - ahp-result.view
 *
 * KAMI Index
 * - kami-index.view | kami-index.calculate
 *
 * Report
 * - report.view | report.export
 *
 * Questionnaire (for leaders)
 * - questionnaire.fill
 * - questionnaire-result.view
 */
export type Permission =
    | 'dashboard.view'
    | 'leader.view'
    | 'leader.create'
    | 'leader.edit'
    | 'leader.delete'
    | 'question.view'
    | 'question.create'
    | 'question.edit'
    | 'question.delete'
    | 'ahp-pairwise.view'
    | 'ahp-pairwise.create'
    | 'ahp-result.view'
    | 'kami-index.view'
    | 'kami-index.calculate'
    | 'report.view'
    | 'report.export'
    | 'questionnaire.fill'
    | 'questionnaire-result.view';

/**
 * Available roles in the application
 * - admin: Full access to administrative features
 * - leader: Restricted access to questionnaire filling and own results
 */
export type Role = 'admin' | 'leader';

/**
 * Authenticated user with roles and permissions
 * This type is shared between Laravel and React via Inertia
 */
export interface AuthUser {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    permissions: Permission[];
}

/**
 * Check if user has ANY of the given permission(s)
 * @param permission - Single permission or array of permissions
 * @param userPermissions - User's permission list
 * @returns true if user has at least one of the permissions
 *
 * @example
 * can('dashboard.view', userPermissions) // true if user has dashboard.view
 * can(['leader.create', 'leader.edit'], userPermissions) // true if user has either
 */
export function can(permission: Permission | Permission[], userPermissions: Permission[]): boolean {
    const permissions = Array.isArray(permission) ? permission : [permission];
    return permissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Check if user has ALL of the given permissions
 * @param permissions - Array of required permissions
 * @param userPermissions - User's permission list
 * @returns true if user has all the permissions
 *
 * @example
 * canAll(['report.view', 'report.export'], userPermissions)
 * // true only if user has both permissions
 */
export function canAll(permissions: Permission[], userPermissions: Permission[]): boolean {
    return permissions.every((perm) => userPermissions.includes(perm));
}

/**
 * Check if user has ANY of the given role(s)
 * Utility function for role checking (not used for access gates/authorization)
 * @param role - Single role or array of roles
 * @param userRoles - User's role list
 * @returns true if user has at least one of the roles
 *
 * @example
 * hasRole('admin', userRoles) // true if user is admin
 * hasRole(['admin', 'leader'], userRoles) // true if user is either admin or leader
 *
 * @note This function is for informational purposes only.
 * Always use permission checks (can/canAll) for authorization gates.
 */
export function hasRole(role: Role | Role[], userRoles: Role[]): boolean {
    const roles = Array.isArray(role) ? role : [role];
    return roles.some((r) => userRoles.includes(r));
}
