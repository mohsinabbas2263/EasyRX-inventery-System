/**
 * Document State Management System
 * Manages lifecycle states for business documents (Sales, GRN, Transfers, Adjustments)
 * 
 * STRICT COMPLIANCE:
 * - Document-type-aware state transitions
 * - GRN/Purchase MUST go through approval
 * - POS sales auto-post (system action)
 * - Reversal requires manager approval with reason
 */

// ==================== DOCUMENT STATES ====================
export const DOCUMENT_STATES = {
    DRAFT: 'draft',
    APPROVED: 'approved',
    POSTED: 'posted',
    SYNCED: 'synced',
    FAILED: 'failed',
    EXCEPTION: 'exception',
    REVERSED: 'reversed', // Terminal state
};

// ==================== DOCUMENT TYPES ====================
export const DOCUMENT_TYPES = {
    SALE: 'sale',
    GRN: 'grn',
    PURCHASE: 'purchase',
    TRANSFER: 'transfer',
    ADJUSTMENT: 'adjustment',
};

// ==================== DOCUMENT TYPE CONFIGURATIONS ====================
/**
 * Configuration for each document type
 * Defines approval requirements and posting behavior
 */
export const DOCUMENT_TYPE_CONFIG = {
    [DOCUMENT_TYPES.GRN]: {
        requiresApproval: true,
        allowDirectPosting: false, // MUST go Draft → Approved → Posted
        autoPost: false,
        description: 'Goods Receipt Note - requires manager approval before posting',
    },
    [DOCUMENT_TYPES.PURCHASE]: {
        requiresApproval: true,
        allowDirectPosting: false, // MUST go Draft → Approved → Posted
        autoPost: false,
        description: 'Purchase Order - requires manager approval before posting',
    },
    [DOCUMENT_TYPES.SALE]: {
        requiresApproval: false,
        allowDirectPosting: true, // POS can complete sale directly
        autoPost: true, // System auto-posts when cashier completes sale
        description: 'Sale/POS Transaction - auto-posted on completion',
    },
    [DOCUMENT_TYPES.TRANSFER]: {
        requiresApproval: true,
        allowDirectPosting: false,
        autoPost: false,
        description: 'Stock Transfer - requires approval before posting',
    },
    [DOCUMENT_TYPES.ADJUSTMENT]: {
        requiresApproval: true,
        allowDirectPosting: false,
        autoPost: false,
        description: 'Stock Adjustment - requires manager approval',
    },
};

// ==================== DOCUMENT-TYPE-AWARE STATE TRANSITIONS ====================
/**
 * Get allowed transitions for a specific document type and current state
 * This enforces document-type-specific workflows
 */
export const getAllowedTransitions = (documentType, currentState) => {
    const config = DOCUMENT_TYPE_CONFIG[documentType];

    if (!config) {
        console.warn(`Unknown document type: ${documentType}, using default transitions`);
        return getDefaultTransitions(currentState);
    }

    // Define transitions based on document type
    switch (currentState) {
        case DOCUMENT_STATES.DRAFT:
            if (config.requiresApproval && !config.allowDirectPosting) {
                // GRN/Purchase/Transfer/Adjustment: MUST go through approval
                return [DOCUMENT_STATES.APPROVED];
            } else if (config.allowDirectPosting) {
                // Sale: Can go directly to posted (or approved if needed)
                return [DOCUMENT_STATES.APPROVED, DOCUMENT_STATES.POSTED];
            }
            return [DOCUMENT_STATES.APPROVED];

        case DOCUMENT_STATES.APPROVED:
            // Approved documents can be posted or sent back to draft
            return [DOCUMENT_STATES.POSTED, DOCUMENT_STATES.DRAFT];

        case DOCUMENT_STATES.POSTED:
            // Posted documents can sync, fail, or be reversed
            return [DOCUMENT_STATES.SYNCED, DOCUMENT_STATES.FAILED, DOCUMENT_STATES.REVERSED];

        case DOCUMENT_STATES.SYNCED:
            // Synced documents can have exceptions or be reversed
            return [DOCUMENT_STATES.EXCEPTION, DOCUMENT_STATES.REVERSED];

        case DOCUMENT_STATES.FAILED:
            // Failed sync can retry (back to posted) or become exception
            return [DOCUMENT_STATES.POSTED, DOCUMENT_STATES.EXCEPTION];

        case DOCUMENT_STATES.EXCEPTION:
            // Exceptions can be resolved back to synced
            return [DOCUMENT_STATES.SYNCED];

        case DOCUMENT_STATES.REVERSED:
            // Terminal state - no transitions
            return [];

        default:
            return [];
    }
};

/**
 * Default transitions (fallback for unknown document types)
 */
const getDefaultTransitions = (currentState) => {
    const defaults = {
        [DOCUMENT_STATES.DRAFT]: [DOCUMENT_STATES.APPROVED],
        [DOCUMENT_STATES.APPROVED]: [DOCUMENT_STATES.POSTED, DOCUMENT_STATES.DRAFT],
        [DOCUMENT_STATES.POSTED]: [DOCUMENT_STATES.SYNCED, DOCUMENT_STATES.FAILED, DOCUMENT_STATES.REVERSED],
        [DOCUMENT_STATES.SYNCED]: [DOCUMENT_STATES.EXCEPTION, DOCUMENT_STATES.REVERSED],
        [DOCUMENT_STATES.FAILED]: [DOCUMENT_STATES.POSTED, DOCUMENT_STATES.EXCEPTION],
        [DOCUMENT_STATES.EXCEPTION]: [DOCUMENT_STATES.SYNCED],
        [DOCUMENT_STATES.REVERSED]: [],
    };
    return defaults[currentState] || [];
};

// ==================== STATE METADATA ====================
export const STATE_METADATA = {
    [DOCUMENT_STATES.DRAFT]: {
        label: 'Draft',
        color: 'bg-slate-100 text-slate-700 border-slate-200',
        dotColor: 'bg-slate-500',
        description: 'Document is in draft mode and can be edited',
        canEdit: true,
        canDelete: true,
        canPost: true,
        canReverse: false,
    },
    [DOCUMENT_STATES.APPROVED]: {
        label: 'Approved',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        dotColor: 'bg-blue-500',
        description: 'Document is approved and ready to be posted',
        canEdit: false,
        canDelete: false,
        canPost: true,
        canReverse: false,
    },
    [DOCUMENT_STATES.POSTED]: {
        label: 'Posted',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        dotColor: 'bg-emerald-500',
        description: 'Document is posted and affects inventory',
        canEdit: false,
        canDelete: false,
        canPost: false,
        canReverse: true,
    },
    [DOCUMENT_STATES.SYNCED]: {
        label: 'Synced',
        color: 'bg-green-100 text-green-700 border-green-200',
        dotColor: 'bg-green-500',
        description: 'Document is synced with server',
        canEdit: false,
        canDelete: false,
        canPost: false,
        canReverse: true,
    },
    [DOCUMENT_STATES.FAILED]: {
        label: 'Failed',
        color: 'bg-red-100 text-red-700 border-red-200',
        dotColor: 'bg-red-500',
        description: 'Document sync failed - needs attention',
        canEdit: false,
        canDelete: false,
        canPost: false,
        canReverse: false,
    },
    [DOCUMENT_STATES.EXCEPTION]: {
        label: 'Exception',
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        dotColor: 'bg-orange-500',
        description: 'Document has exceptions - requires resolution',
        canEdit: false,
        canDelete: false,
        canPost: false,
        canReverse: false,
    },
    [DOCUMENT_STATES.REVERSED]: {
        label: 'Reversed',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        dotColor: 'bg-purple-500',
        description: 'Document has been reversed',
        canEdit: false,
        canDelete: false,
        canPost: false,
        canReverse: false,
    },
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if a state transition is allowed for a specific document type
 * STRICT: Uses document-type-aware transitions
 */
export const canTransitionTo = (documentType, currentState, targetState) => {
    const allowedStates = getAllowedTransitions(documentType, currentState);
    return allowedStates.includes(targetState);
};

/**
 * Check if a document can be edited
 */
export const canEditDocument = (state, role) => {
    const metadata = STATE_METADATA[state];
    return metadata?.canEdit || false;
};

/**
 * Check if a document can be deleted
 * STRICT: Only drafts can be deleted, and only by creator or manager
 */
export const canDeleteDocument = (state, role, createdBy, currentUser) => {
    const metadata = STATE_METADATA[state];
    if (!metadata?.canDelete) return false;

    // Only drafts can be deleted
    if (state !== DOCUMENT_STATES.DRAFT) return false;

    // Creator or manager can delete drafts
    return createdBy === currentUser || ['Admin', 'Manager', 'HO Admin'].includes(role);
};

/**
 * Check if a document can be approved
 * STRICT: Only managers can approve, only from draft state
 */
export const canApproveDocument = (documentType, state, role) => {
    // Must be in draft state
    if (state !== DOCUMENT_STATES.DRAFT) return false;

    // Check if document type requires approval
    const config = DOCUMENT_TYPE_CONFIG[documentType];
    if (!config || !config.requiresApproval) return false;

    // Only managers can approve
    return ['Admin', 'Manager', 'HO Admin'].includes(role);
};

/**
 * Check if a document can be posted
 * STRICT: Document-type-aware posting rules
 */
export const canPostDocument = (documentType, state, role) => {
    const config = DOCUMENT_TYPE_CONFIG[documentType];

    if (!config) return false;

    // Check if transition is allowed
    const allowedTransitions = getAllowedTransitions(documentType, state);
    if (!allowedTransitions.includes(DOCUMENT_STATES.POSTED)) return false;

    // For GRN/Purchase: must be approved first (no direct posting from draft)
    if (config.requiresApproval && !config.allowDirectPosting) {
        if (state !== DOCUMENT_STATES.APPROVED) return false;
        // Only managers can post approved GRN/Purchase
        return ['Admin', 'Manager', 'HO Admin'].includes(role);
    }

    // For Sales: system auto-posts (but allow manual for testing)
    if (config.autoPost) {
        // Sales are auto-posted by system, but allow managers to post manually
        return ['Admin', 'Manager', 'HO Admin', 'Pharmacist'].includes(role);
    }

    // Default: managers can post
    return ['Admin', 'Manager', 'HO Admin'].includes(role);
};

/**
 * Check if a document can be reversed
 * STRICT: Only posted/synced documents, only by managers, requires reason
 */
export const canReverseDocument = (state, role) => {
    const metadata = STATE_METADATA[state];
    if (!metadata?.canReverse) return false;

    // Only posted or synced documents can be reversed
    if (![DOCUMENT_STATES.POSTED, DOCUMENT_STATES.SYNCED].includes(state)) return false;

    // Only managers can reverse
    return ['Admin', 'Manager', 'HO Admin'].includes(role);
};

/**
 * Get state badge configuration
 */
export const getStateBadge = (state) => {
    return STATE_METADATA[state] || STATE_METADATA[DOCUMENT_STATES.DRAFT];
};

/**
 * Check if document is in a final state (cannot be modified)
 */
export const isFinalState = (state) => {
    return [
        DOCUMENT_STATES.POSTED,
        DOCUMENT_STATES.SYNCED,
        DOCUMENT_STATES.REVERSED
    ].includes(state);
};

/**
 * Check if document requires attention
 */
export const requiresAttention = (state) => {
    return [
        DOCUMENT_STATES.FAILED,
        DOCUMENT_STATES.EXCEPTION
    ].includes(state);
};

/**
 * Get available actions for a document
 */
export const getAvailableActions = (document, role, currentUser) => {
    const actions = [];
    const state = document.state || DOCUMENT_STATES.DRAFT;

    // View is always available
    actions.push({ type: 'view', label: 'View', icon: 'Eye' });

    // Edit (only for drafts)
    if (canEditDocument(state, role)) {
        actions.push({ type: 'edit', label: 'Edit', icon: 'Edit' });
    }

    // Delete (only for drafts, by creator or manager)
    if (canDeleteDocument(state, role, document.createdBy, currentUser)) {
        actions.push({ type: 'delete', label: 'Delete', icon: 'Trash2', requiresConfirmation: true });
    }

    // Post (for drafts and approved)
    if (canPostDocument(state, role)) {
        actions.push({ type: 'post', label: 'Post', icon: 'Send', requiresConfirmation: true });
    }

    // Approve (for drafts, managers only)
    if (state === DOCUMENT_STATES.DRAFT && ['Admin', 'Manager', 'HO Admin'].includes(role)) {
        actions.push({ type: 'approve', label: 'Approve', icon: 'CheckCircle', requiresConfirmation: true });
    }

    // Reverse (for posted/synced, managers only)
    if (canReverseDocument(state, role)) {
        actions.push({ type: 'reverse', label: 'Reverse', icon: 'RotateCcw', requiresConfirmation: true, requiresReason: true });
    }

    // Retry (for failed)
    if (state === DOCUMENT_STATES.FAILED && ['Admin', 'Manager', 'HO Admin'].includes(role)) {
        actions.push({ type: 'retry', label: 'Retry Sync', icon: 'RefreshCw' });
    }

    // Resolve (for exceptions)
    if (state === DOCUMENT_STATES.EXCEPTION && ['Admin', 'Manager', 'HO Admin'].includes(role)) {
        actions.push({ type: 'resolve', label: 'Resolve', icon: 'CheckCircle' });
    }

    return actions;
};

/**
 * Create audit log entry for document action
 */
export const createAuditLog = (documentId, documentType, action, user, reason = null, metadata = {}) => {
    return {
        documentId,
        documentType,
        action,
        user,
        reason,
        metadata,
        timestamp: new Date().toISOString(),
    };
};
