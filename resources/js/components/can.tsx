/**
 * Permission-based conditional rendering components
 * These components provide elegant ways to show/hide UI based on user permissions
 */

import { usePermission } from '@/hooks/use-permission';
import type { Permission } from '@/lib/permissions';
import { ReactNode } from 'react';

interface CanProps {
    /** Single permission or array of permissions - user needs at least one */
    permission: Permission | Permission[];
    /** Content to render if user has permission */
    children: ReactNode;
    /** Content to render if user does not have permission (default: null) */
    fallback?: ReactNode;
}

/**
 * Render children if user has ANY of the given permission(s)
 *
 * @example
 * <Can permission="leader.create">
 *   <Button>Tambah Pimpinan</Button>
 * </Can>
 *
 * @example
 * <Can
 *   permission={['report.view', 'report.export']}
 *   fallback={<p>Tidak ada akses</p>}
 * >
 *   <ReportTable />
 * </Can>
 */
export function Can({ permission, children, fallback = null }: CanProps): ReactNode {
    const { can } = usePermission();

    if (can(permission)) {
        return children;
    }

    return fallback;
}

interface CanAllProps {
    /** Array of required permissions - user must have all of them */
    permissions: Permission[];
    /** Content to render if user has all permissions */
    children: ReactNode;
    /** Content to render if user does not have all permissions (default: null) */
    fallback?: ReactNode;
}

/**
 * Render children if user has ALL of the given permissions
 *
 * @example
 * <CanAll permissions={['report.view', 'report.export']}>
 *   <ExportButton />
 * </CanAll>
 *
 * @example
 * <CanAll
 *   permissions={['kami-index.view', 'kami-index.calculate']}
 *   fallback={<Alert>Akses terbatas ke view saja</Alert>}
 * >
 *   <KamiCalculator />
 * </CanAll>
 */
export function CanAll({ permissions, children, fallback = null }: CanAllProps): ReactNode {
    const { canAll } = usePermission();

    if (canAll(permissions)) {
        return children;
    }

    return fallback;
}
