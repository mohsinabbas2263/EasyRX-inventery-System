import { useMemo } from 'react';
import {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getRolePermissions,
    canAccessMenuItem,
    getAccessibleMenuItems,
    isAdmin,
    isPharmacist,
    isCashier,
    getRoleDisplayName,
    getRoleBadgeClass,
    getRoleDescription,
} from '../utils/permissions';

/**
 * Custom hook for permission management
 * @param {string} role - Current user role
 * @returns {object} Permission utilities
 */
export const usePermissions = (role) => {
    // Memoize permission checks to avoid recalculation
    const permissions = useMemo(() => ({
        // Get all permissions for current role
        all: getRolePermissions(role),

        // Check single permission
        has: (permission) => hasPermission(role, permission),

        // Check any of multiple permissions
        hasAny: (permissions) => hasAnyPermission(role, permissions),

        // Check all of multiple permissions
        hasAll: (permissions) => hasAllPermissions(role, permissions),

        // Check menu item access
        canAccessMenu: (menuItem) => canAccessMenuItem(role, menuItem),

        // Get accessible menu items
        accessibleMenus: getAccessibleMenuItems(role),

        // Role checks
        isAdmin: isAdmin(role),
        isPharmacist: isPharmacist(role),
        isCashier: isCashier(role),

        // Role info
        displayName: getRoleDisplayName(role),
        badgeClass: getRoleBadgeClass(role),
        description: getRoleDescription(role),
    }), [role]);

    return permissions;
};

export default usePermissions;
