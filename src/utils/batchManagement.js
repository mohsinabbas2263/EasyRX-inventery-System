/**
 * Batch Management and FEFO (First Expiry First Out) Enforcement
 * Handles automatic batch selection, expiry validation, and stock allocation
 * 
 * STRICT COMPLIANCE:
 * - Uses permission-based checks (not role strings)
 * - FEFO enforced for users without POS_OVERRIDE_BATCH permission
 * - Expired stock completely blocked
 * - Medicine-specific batch/expiry enforcement
 */

import { hasPermission, PERMISSIONS } from './permissions';

// ==================== BATCH STATUS ====================
export const BATCH_STATUS = {
    GOOD: 'good',
    NEAR_EXPIRY: 'near_expiry', // Within 3 months of expiry
    EXPIRED: 'expired',
    BLOCKED: 'blocked', // Manually blocked
};

// ==================== COMPANY SETTINGS ====================
/**
 * Company-wide settings for batch/expiry management
 * These should be configurable per company
 */
export const BATCH_SETTINGS = {
    nearExpiryDays: 90, // Days before expiry to show warning (default 3 months)
    allowExpiryToday: false, // Whether to allow dispensing items expiring today
    requireBatchForMedicine: true, // Medicines must have batch number
    requireExpiryForMedicine: true, // Medicines must have expiry date
};

/**
 * Update batch settings (for company configuration)
 */
export const updateBatchSettings = (newSettings) => {
    Object.assign(BATCH_SETTINGS, newSettings);
};

// ==================== BATCH UTILITIES ====================

/**
 * Calculate batch status based on expiry date
 */
export const calculateBatchStatus = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0); // Start of day

    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    // Check if expired (or expiring today if not allowed)
    if (daysUntilExpiry < 0 || (daysUntilExpiry === 0 && !BATCH_SETTINGS.allowExpiryToday)) {
        return BATCH_STATUS.EXPIRED;
    } else if (daysUntilExpiry <= BATCH_SETTINGS.nearExpiryDays) {
        return BATCH_STATUS.NEAR_EXPIRY;
    } else {
        return BATCH_STATUS.GOOD;
    }
};

/**
 * Check if batch is expired
 */
export const isBatchExpired = (expiryDate) => {
    return calculateBatchStatus(expiryDate) === BATCH_STATUS.EXPIRED;
};

/**
 * Check if batch is near expiry
 */
export const isBatchNearExpiry = (expiryDate) => {
    return calculateBatchStatus(expiryDate) === BATCH_STATUS.NEAR_EXPIRY;
};

/**
 * Check if batch can be sold/dispensed
 */
export const canSellBatch = (batch) => {
    const status = calculateBatchStatus(batch.expiryDate);
    return status !== BATCH_STATUS.EXPIRED && status !== BATCH_STATUS.BLOCKED;
};

/**
 * Validate medicine has required batch and expiry
 * STRICT: Medicines MUST have batch + expiry
 */
export const validateMedicineBatchExpiry = (product, batch) => {
    const errors = [];

    // Check if product is a medicine
    if (!product.isMedicine) {
        return { isValid: true, errors: [], warnings: [] };
    }

    // Medicines must have batch number
    if (BATCH_SETTINGS.requireBatchForMedicine && (!batch || !batch.batchNo)) {
        errors.push('Batch number is required for medicines');
    }

    // Medicines must have expiry date
    if (BATCH_SETTINGS.requireExpiryForMedicine && (!batch || !batch.expiryDate)) {
        errors.push('Expiry date is required for medicines');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings: []
    };
};

/**
 * Sort batches by FEFO (First Expiry First Out)
 * Returns batches sorted by expiry date (earliest first)
 */
export const sortBatchesByFEFO = (batches) => {
    return [...batches].sort((a, b) => {
        const dateA = new Date(a.expiryDate);
        const dateB = new Date(b.expiryDate);
        return dateA - dateB;
    });
};

/**
 * Automatically allocate stock from batches using FEFO
 * Returns array of batch allocations
 */
export const allocateStockFEFO = (batches, requestedQuantity) => {
    const allocations = [];
    let remainingQuantity = requestedQuantity;

    // Filter out expired and blocked batches
    const availableBatches = batches.filter(canSellBatch);

    // Sort by FEFO
    const sortedBatches = sortBatchesByFEFO(availableBatches);

    for (const batch of sortedBatches) {
        if (remainingQuantity <= 0) break;

        const availableQty = batch.quantity || 0;
        const allocatedQty = Math.min(availableQty, remainingQuantity);

        if (allocatedQty > 0) {
            allocations.push({
                batchNo: batch.batchNo,
                expiryDate: batch.expiryDate,
                quantity: allocatedQty,
                location: batch.location,
                status: calculateBatchStatus(batch.expiryDate),
            });

            remainingQuantity -= allocatedQty;
        }
    }

    return {
        allocations,
        fullyAllocated: remainingQuantity === 0,
        shortfall: remainingQuantity,
    };
};

/**
 * Get batch status badge configuration
 */
export const getBatchStatusBadge = (expiryDate) => {
    const status = calculateBatchStatus(expiryDate);

    const badges = {
        [BATCH_STATUS.GOOD]: {
            label: 'Good',
            color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            icon: 'CheckCircle',
        },
        [BATCH_STATUS.NEAR_EXPIRY]: {
            label: 'Near Expiry',
            color: 'bg-amber-100 text-amber-700 border-amber-200',
            icon: 'AlertTriangle',
        },
        [BATCH_STATUS.EXPIRED]: {
            label: 'Expired',
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: 'XCircle',
        },
        [BATCH_STATUS.BLOCKED]: {
            label: 'Blocked',
            color: 'bg-slate-100 text-slate-700 border-slate-200',
            icon: 'Ban',
        },
    };

    return badges[status] || badges[BATCH_STATUS.GOOD];
};

/**
 * Validate batch selection for sale
 */
export const validateBatchForSale = (batch, role) => {
    const errors = [];

    // Check if expired
    if (isBatchExpired(batch.expiryDate)) {
        errors.push('Batch is expired and cannot be sold');
    }

    // Check if blocked
    if (batch.status === BATCH_STATUS.BLOCKED) {
        errors.push('Batch is blocked and cannot be sold');
    }

    // Check quantity
    if (!batch.quantity || batch.quantity <= 0) {
        errors.push('Batch has no available stock');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings: isBatchNearExpiry(batch.expiryDate) ? ['Batch is near expiry'] : [],
    };
};

/**
 * Check if user can manually select batch
 * STRICT: Uses permission check instead of role string
 */
export const canManuallySelectBatch = (role) => {
    return hasPermission(role, PERMISSIONS.POS_OVERRIDE_BATCH);
};

/**
 * Get batch selection mode based on role
 */
export const getBatchSelectionMode = (role) => {
    if (canManuallySelectBatch(role)) {
        return {
            mode: 'manual',
            description: 'You can manually select batches or use automatic FEFO allocation',
            allowOverride: true,
        };
    } else {
        return {
            mode: 'auto',
            description: 'Batches are automatically selected using FEFO (First Expiry First Out)',
            allowOverride: false,
        };
    }
};

/**
 * Format expiry date for display
 */
export const formatExpiryDate = (expiryDate) => {
    const date = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    const formattedDate = date.toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    if (daysUntilExpiry < 0) {
        return `${formattedDate} (Expired ${Math.abs(daysUntilExpiry)} days ago)`;
    } else if (daysUntilExpiry <= 30) {
        return `${formattedDate} (${daysUntilExpiry} days left)`;
    } else {
        return formattedDate;
    }
};

/**
 * Get expiry warning level
 */
export const getExpiryWarningLevel = (expiryDate) => {
    const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'critical';
    if (daysUntilExpiry <= 90) return 'warning';
    return 'normal';
};
