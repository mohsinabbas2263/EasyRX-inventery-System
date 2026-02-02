import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Permission Guard Component
 * Conditionally renders children based on permissions
 */
export const PermissionGuard = ({
    role,
    permission,
    permissions,
    requireAll = false,
    fallback = null,
    children
}) => {
    const perms = usePermissions(role);

    // Check permissions
    let hasAccess = false;

    if (permission) {
        // Single permission check
        hasAccess = perms.has(permission);
    } else if (permissions && permissions.length > 0) {
        // Multiple permissions check
        hasAccess = requireAll
            ? perms.hasAll(permissions)
            : perms.hasAny(permissions);
    } else {
        // No permission specified, allow access
        hasAccess = true;
    }

    // Render children if has access, otherwise render fallback
    return hasAccess ? <>{children}</> : <>{fallback}</>;
};

/**
 * Hide Component - Hides content if no permission
 */
export const Hide = ({ role, permission, permissions, requireAll, children }) => {
    return (
        <PermissionGuard
            role={role}
            permission={permission}
            permissions={permissions}
            requireAll={requireAll}
            fallback={null}
        >
            {children}
        </PermissionGuard>
    );
};

/**
 * Show Component - Shows content only if has permission
 */
export const Show = Hide; // Alias for clarity

/**
 * Disable Component - Disables content if no permission
 */
export const Disable = ({ role, permission, permissions, requireAll, children }) => {
    const perms = usePermissions(role);

    let hasAccess = false;

    if (permission) {
        hasAccess = perms.has(permission);
    } else if (permissions && permissions.length > 0) {
        hasAccess = requireAll
            ? perms.hasAll(permissions)
            : perms.hasAny(permissions);
    } else {
        hasAccess = true;
    }

    // Clone children and add disabled prop if no access
    if (!hasAccess && React.isValidElement(children)) {
        return React.cloneElement(children, {
            disabled: true,
            className: `${children.props.className || ''} opacity-50 cursor-not-allowed`,
            title: 'You do not have permission to perform this action',
        });
    }

    return <>{children}</>;
};

export default PermissionGuard;
