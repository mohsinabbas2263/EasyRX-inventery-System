/**
 * Permission System for EazyRX
 * Role-based access control utilities
 * 
 * STRICT COMPLIANCE:
 * - Pharmacist: Can dispense/controlled, CANNOT post GRN/purchases
 * - Cashier: Can complete POS sale (auto-posted by system), CANNOT manually post
 * - Separation of duties enforced
 */

// ==================== ROLES ====================
export const ROLES = {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    HO_ADMIN: 'HO Admin',
    PHARMACIST: 'Pharmacist',
    CASHIER: 'Cashier',
    AUDITOR: 'Auditor',
};

// ==================== PERMISSIONS ====================
export const PERMISSIONS = {
    // Dashboard
    DASHBOARD_VIEW: 'dashboard.view',
    DASHBOARD_FULL: 'dashboard.full',

    // Products
    PRODUCTS_VIEW: 'products.view',
    PRODUCTS_CREATE: 'products.create',
    PRODUCTS_UPDATE: 'products.update',
    PRODUCTS_DELETE: 'products.delete',
    PRODUCTS_EDIT_PRICE: 'products.edit_price',

    // Inventory
    INVENTORY_VIEW: 'inventory.view',
    INVENTORY_MANAGE: 'inventory.manage',
    INVENTORY_ADJUST: 'inventory.adjust',

    // Suppliers
    SUPPLIERS_VIEW: 'suppliers.view',
    SUPPLIERS_MANAGE: 'suppliers.manage',

    // GRN (Goods Receipt Note)
    GRN_VIEW: 'grn.view',
    GRN_CREATE: 'grn.create',
    GRN_APPROVE: 'grn.approve',
    GRN_REJECT: 'grn.reject',
    GRN_POST: 'grn.post',
    GRN_REVERSE: 'grn.reverse',

    // POS (Point of Sale)
    POS_ACCESS: 'pos.access',
    POS_COMPLETE_SALE: 'pos.complete_sale', // Cashier can complete sale (system auto-posts)
    POS_DISCOUNT: 'pos.discount',
    POS_REFUND: 'pos.refund',
    POS_EDIT_PRICE: 'pos.edit_price',
    POS_OVERRIDE_BATCH: 'pos.override_batch',
    POS_DISPENSE_CONTROLLED: 'pos.dispense_controlled',

    // Sales
    SALES_VIEW: 'sales.view',
    SALES_CREATE: 'sales.create',
    SALES_POST: 'sales.post', // Manual posting (managers only)
    SALES_REVERSE: 'sales.reverse',

    // Documents
    DOCUMENTS_DELETE_DRAFT: 'documents.delete_draft',
    DOCUMENTS_APPROVE: 'documents.approve',
    DOCUMENTS_POST: 'documents.post',
    DOCUMENTS_REVERSE: 'documents.reverse',

    // Reports
    REPORTS_VIEW: 'reports.view',
    REPORTS_SALES: 'reports.sales',
    REPORTS_INVENTORY: 'reports.inventory',
    REPORTS_PURCHASE: 'reports.purchase',
    REPORTS_FINANCIAL: 'reports.financial',
    REPORTS_EXPORT: 'reports.export',

    // Settings
    SETTINGS_VIEW: 'settings.view',
    SETTINGS_MANAGE: 'settings.manage',
};

// ==================== ROLE PERMISSIONS MATRIX ====================
export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        // Dashboard
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.DASHBOARD_FULL,

        // Products
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.PRODUCTS_CREATE,
        PERMISSIONS.PRODUCTS_UPDATE,
        PERMISSIONS.PRODUCTS_DELETE,
        PERMISSIONS.PRODUCTS_EDIT_PRICE,

        // Inventory
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.INVENTORY_MANAGE,
        PERMISSIONS.INVENTORY_ADJUST,

        // Suppliers
        PERMISSIONS.SUPPLIERS_VIEW,
        PERMISSIONS.SUPPLIERS_MANAGE,

        // GRN
        PERMISSIONS.GRN_VIEW,
        PERMISSIONS.GRN_CREATE,
        PERMISSIONS.GRN_APPROVE,
        PERMISSIONS.GRN_REJECT,
        PERMISSIONS.GRN_POST,
        PERMISSIONS.GRN_REVERSE,

        // POS
        PERMISSIONS.POS_ACCESS,
        PERMISSIONS.POS_DISCOUNT,
        PERMISSIONS.POS_REFUND,
        PERMISSIONS.POS_EDIT_PRICE,
        PERMISSIONS.POS_OVERRIDE_BATCH,
        PERMISSIONS.POS_DISPENSE_CONTROLLED,

        // Sales
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.SALES_CREATE,
        PERMISSIONS.SALES_POST,
        PERMISSIONS.SALES_REVERSE,

        // Documents
        PERMISSIONS.DOCUMENTS_DELETE_DRAFT,
        PERMISSIONS.DOCUMENTS_APPROVE,
        PERMISSIONS.DOCUMENTS_POST,
        PERMISSIONS.DOCUMENTS_REVERSE,

        // Reports
        PERMISSIONS.REPORTS_VIEW,
        PERMISSIONS.REPORTS_SALES,
        PERMISSIONS.REPORTS_INVENTORY,
        PERMISSIONS.REPORTS_PURCHASE,
        PERMISSIONS.REPORTS_FINANCIAL,
        PERMISSIONS.REPORTS_EXPORT,

        // Settings
        PERMISSIONS.SETTINGS_VIEW,
        PERMISSIONS.SETTINGS_MANAGE,
    ],

    [ROLES.MANAGER]: [
        // Dashboard
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.DASHBOARD_FULL,

        // Products
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.PRODUCTS_CREATE,
        PERMISSIONS.PRODUCTS_UPDATE,
        PERMISSIONS.PRODUCTS_EDIT_PRICE,

        // Inventory
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.INVENTORY_MANAGE,
        PERMISSIONS.INVENTORY_ADJUST,

        // Suppliers
        PERMISSIONS.SUPPLIERS_VIEW,
        PERMISSIONS.SUPPLIERS_MANAGE,

        // GRN
        PERMISSIONS.GRN_VIEW,
        PERMISSIONS.GRN_CREATE,
        PERMISSIONS.GRN_APPROVE,
        PERMISSIONS.GRN_REJECT,
        PERMISSIONS.GRN_POST,
        PERMISSIONS.GRN_REVERSE,

        // POS
        PERMISSIONS.POS_ACCESS,
        PERMISSIONS.POS_DISCOUNT,
        PERMISSIONS.POS_REFUND,
        PERMISSIONS.POS_OVERRIDE_BATCH,
        PERMISSIONS.POS_DISPENSE_CONTROLLED,

        // Sales
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.SALES_CREATE,
        PERMISSIONS.SALES_POST,
        PERMISSIONS.SALES_REVERSE,

        // Documents
        PERMISSIONS.DOCUMENTS_DELETE_DRAFT,
        PERMISSIONS.DOCUMENTS_APPROVE,
        PERMISSIONS.DOCUMENTS_POST,
        PERMISSIONS.DOCUMENTS_REVERSE,

        // Reports
        PERMISSIONS.REPORTS_VIEW,
        PERMISSIONS.REPORTS_SALES,
        PERMISSIONS.REPORTS_INVENTORY,
        PERMISSIONS.REPORTS_PURCHASE,
        PERMISSIONS.REPORTS_FINANCIAL,
        PERMISSIONS.REPORTS_EXPORT,
    ],

    [ROLES.HO_ADMIN]: [
        // Same as Manager
        ...ROLE_PERMISSIONS[ROLES.MANAGER] || [],
        PERMISSIONS.SETTINGS_VIEW,
        PERMISSIONS.SETTINGS_MANAGE,
    ],

    [ROLES.PHARMACIST]: [
        // Dashboard
        PERMISSIONS.DASHBOARD_VIEW,

        // Products
        PERMISSIONS.PRODUCTS_VIEW,
        PERMISSIONS.PRODUCTS_CREATE,
        PERMISSIONS.PRODUCTS_UPDATE,
        // NO DELETE, NO PRICE EDIT

        // Inventory
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.INVENTORY_MANAGE,
        // NO ADJUST

        // Suppliers
        PERMISSIONS.SUPPLIERS_VIEW,
        // NO MANAGE

        // GRN
        PERMISSIONS.GRN_VIEW,
        PERMISSIONS.GRN_CREATE,
        // NO POST - Pharmacist creates GRN drafts, managers approve & post
        // NO APPROVE/REJECT/REVERSE

        // POS
        PERMISSIONS.POS_ACCESS,
        PERMISSIONS.POS_COMPLETE_SALE, // Can complete sales (system auto-posts)
        PERMISSIONS.POS_DISCOUNT,
        PERMISSIONS.POS_REFUND,
        PERMISSIONS.POS_OVERRIDE_BATCH,
        PERMISSIONS.POS_DISPENSE_CONTROLLED, // Licensed to dispense controlled drugs

        // Sales
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.SALES_CREATE,
        // NO SALES_POST - Sales auto-post on completion
        // NO REVERSE

        // Documents
        PERMISSIONS.DOCUMENTS_DELETE_DRAFT, // Can delete own drafts
        // NO APPROVE - Cannot approve documents
        // NO POST - Cannot manually post documents
        // NO REVERSE - Cannot reverse documents

        // Reports
        PERMISSIONS.REPORTS_VIEW,
        PERMISSIONS.REPORTS_SALES,
        PERMISSIONS.REPORTS_INVENTORY,
        PERMISSIONS.REPORTS_EXPORT,
        // NO PURCHASE/FINANCIAL

        // NO SETTINGS
    ],

    [ROLES.CASHIER]: [
        // Dashboard
        PERMISSIONS.DASHBOARD_VIEW,

        // POS
        PERMISSIONS.POS_ACCESS,
        PERMISSIONS.POS_COMPLETE_SALE, // Can complete sales (system auto-posts)
        // NO DISCOUNT - Cannot apply discounts
        // NO REFUND - Cannot process refunds
        // NO PRICE EDIT - Cannot edit prices
        // NO BATCH OVERRIDE - FEFO enforced automatically

        // Sales
        PERMISSIONS.SALES_VIEW,
        PERMISSIONS.SALES_CREATE,
        // NO POST - Sales auto-post on completion, cashier cannot manually post
        // NO REVERSE - Cannot reverse sales

        // NO OTHER PERMISSIONS - Cashier is POS-only role
    ],

    [ROLES.AUDITOR]: [
        // Dashboard
        PERMISSIONS.DASHBOARD_VIEW,

        // Products
        PERMISSIONS.PRODUCTS_VIEW,

        // Inventory
        PERMISSIONS.INVENTORY_VIEW,

        // Suppliers
        PERMISSIONS.SUPPLIERS_VIEW,

        // GRN
        PERMISSIONS.GRN_VIEW,

        // Sales
        PERMISSIONS.SALES_VIEW,

        // Reports
        PERMISSIONS.REPORTS_VIEW,
        PERMISSIONS.REPORTS_SALES,
        PERMISSIONS.REPORTS_INVENTORY,
        PERMISSIONS.REPORTS_PURCHASE,
        PERMISSIONS.REPORTS_FINANCIAL,
        PERMISSIONS.REPORTS_EXPORT,

        // NO WRITE PERMISSIONS
    ],
};

// ==================== MENU ITEMS ====================
export const MENU_ITEMS = {
    DASHBOARD: {
        path: '/dashboard',
        label: 'Dashboard',
        permission: PERMISSIONS.DASHBOARD_VIEW,
    },
    PRODUCTS: {
        path: '/products',
        label: 'Products',
        permission: PERMISSIONS.PRODUCTS_VIEW,
    },
    INVENTORY: {
        path: '/inventory',
        label: 'Inventory',
        permission: PERMISSIONS.INVENTORY_VIEW,
    },
    SUPPLIERS: {
        path: '/suppliers',
        label: 'Suppliers',
        permission: PERMISSIONS.SUPPLIERS_VIEW,
    },
    GRN: {
        path: '/grn',
        label: 'GRN',
        permission: PERMISSIONS.GRN_VIEW,
    },
    POS: {
        path: '/pos',
        label: 'POS',
        permission: PERMISSIONS.POS_ACCESS,
    },
    REPORTS: {
        path: '/reports',
        label: 'Reports',
        permission: PERMISSIONS.REPORTS_VIEW,
    },
    SETTINGS: {
        path: '/settings',
        label: 'Settings',
        permission: PERMISSIONS.SETTINGS_VIEW,
    },
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role, permission) => {
    if (!role || !permission) return false;
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    return rolePermissions.includes(permission);
};

/**
 * Check if a role has any of the specified permissions
 */
export const hasAnyPermission = (role, permissions) => {
    if (!role || !permissions || permissions.length === 0) return false;
    return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a role has all of the specified permissions
 */
export const hasAllPermissions = (role, permissions) => {
    if (!role || !permissions || permissions.length === 0) return false;
    return permissions.every(permission => hasPermission(role, permission));
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (role) => {
    return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if user can access a menu item
 */
export const canAccessMenuItem = (role, menuItem) => {
    if (!menuItem || !menuItem.permission) return true;
    return hasPermission(role, menuItem.permission);
};

/**
 * Get accessible menu items for a role
 */
export const getAccessibleMenuItems = (role) => {
    return Object.values(MENU_ITEMS).filter(item => canAccessMenuItem(role, item));
};

/**
 * Check if role is admin
 */
export const isAdmin = (role) => {
    return role === ROLES.ADMIN;
};

/**
 * Check if role is pharmacist
 */
export const isPharmacist = (role) => {
    return role === ROLES.PHARMACIST;
};

/**
 * Check if role is cashier
 */
export const isCashier = (role) => {
    return role === ROLES.CASHIER;
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role) => {
    const roleNames = {
        [ROLES.ADMIN]: 'Administrator',
        [ROLES.PHARMACIST]: 'Pharmacist',
        [ROLES.CASHIER]: 'Cashier',
    };
    return roleNames[role] || role;
};

/**
 * Get role badge class
 */
export const getRoleBadgeClass = (role) => {
    const badgeClasses = {
        [ROLES.ADMIN]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        [ROLES.PHARMACIST]: 'bg-blue-50 text-blue-700 border-blue-200',
        [ROLES.CASHIER]: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return badgeClasses[role] || 'bg-slate-50 text-slate-700 border-slate-200';
};

/**
 * Get role description
 */
export const getRoleDescription = (role) => {
    const descriptions = {
        [ROLES.ADMIN]: 'Full system access with all permissions',
        [ROLES.MANAGER]: 'Branch manager with approval and reversal rights',
        [ROLES.HO_ADMIN]: 'Head office administrator with full access',
        [ROLES.PHARMACIST]: 'Licensed pharmacist with dispensing rights',
        [ROLES.CASHIER]: 'POS access only for processing sales',
        [ROLES.AUDITOR]: 'Read-only access for auditing purposes',
    };
    return descriptions[role] || '';
};

// ==================== ENHANCED PERMISSION CHECKS ====================

/**
 * Check if user can edit prices
 */
export const canEditPrice = (role) => {
    return hasPermission(role, PERMISSIONS.PRODUCTS_EDIT_PRICE) ||
        hasPermission(role, PERMISSIONS.POS_EDIT_PRICE);
};

/**
 * Check if user can apply discounts
 */
export const canApplyDiscount = (role) => {
    return hasPermission(role, PERMISSIONS.POS_DISCOUNT);
};

/**
 * Check if user can manually override batch selection
 */
export const canOverrideBatch = (role) => {
    return hasPermission(role, PERMISSIONS.POS_OVERRIDE_BATCH);
};

/**
 * Check if user can dispense controlled drugs
 */
export const canDispenseControlled = (role) => {
    return hasPermission(role, PERMISSIONS.POS_DISPENSE_CONTROLLED);
};

/**
 * Check if user can approve documents
 */
export const canApproveDocuments = (role) => {
    return hasPermission(role, PERMISSIONS.DOCUMENTS_APPROVE);
};

/**
 * Check if user can post documents
 */
export const canPostDocuments = (role) => {
    return hasPermission(role, PERMISSIONS.DOCUMENTS_POST);
};

/**
 * Check if user can reverse documents
 */
export const canReverseDocuments = (role) => {
    return hasPermission(role, PERMISSIONS.DOCUMENTS_REVERSE);
};

/**
 * Check if user can delete draft documents
 */
export const canDeleteDrafts = (role) => {
    return hasPermission(role, PERMISSIONS.DOCUMENTS_DELETE_DRAFT);
};

/**
 * Check if role is manager or higher
 */
export const isManagerOrHigher = (role) => {
    return [ROLES.ADMIN, ROLES.MANAGER, ROLES.HO_ADMIN].includes(role);
};

/**
 * Check if role is read-only
 */
export const isReadOnly = (role) => {
    return role === ROLES.AUDITOR;
};

/**
 * Get UI restrictions for role
 */
export const getUIRestrictions = (role) => {
    return {
        canEditPrice: canEditPrice(role),
        canApplyDiscount: canApplyDiscount(role),
        canOverrideBatch: canOverrideBatch(role),
        canDispenseControlled: canDispenseControlled(role),
        canApproveDocuments: canApproveDocuments(role),
        canPostDocuments: canPostDocuments(role),
        canReverseDocuments: canReverseDocuments(role),
        canDeleteDrafts: canDeleteDrafts(role),
        isReadOnly: isReadOnly(role),
        isManager: isManagerOrHigher(role),
    };
};

