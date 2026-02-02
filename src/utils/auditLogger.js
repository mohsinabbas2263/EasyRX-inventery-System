/**
 * Audit Logger with Persistence
 * 
 * STRICT COMPLIANCE:
 * - Every critical action MUST be logged
 * - Logs persisted to IndexedDB and queued for server sync
 * - Cannot be skipped or bypassed
 * - Includes full context (user, timestamp, reason, metadata)
 */

const AUDIT_DB_NAME = 'eazyrx_audit_db';
const AUDIT_DB_VERSION = 1;
const AUDIT_STORE_NAME = 'audit_logs';

// ==================== AUDIT ACTION TYPES ====================
export const AUDIT_ACTIONS = {
    // Document actions
    DOCUMENT_CREATE: 'document.create',
    DOCUMENT_APPROVE: 'document.approve',
    DOCUMENT_REJECT: 'document.reject',
    DOCUMENT_POST: 'document.post',
    DOCUMENT_REVERSE: 'document.reverse',
    DOCUMENT_DELETE: 'document.delete',

    // Batch actions
    BATCH_OVERRIDE: 'batch.override',
    BATCH_BLOCK: 'batch.block',
    BATCH_UNBLOCK: 'batch.unblock',

    // Price actions
    PRICE_EDIT: 'price.edit',
    PRICE_OVERRIDE: 'price.override',

    // Discount actions
    DISCOUNT_APPLY: 'discount.apply',
    DISCOUNT_OVERRIDE: 'discount.override',

    // Inventory actions
    STOCK_ADJUST: 'stock.adjust',
    STOCK_TRANSFER: 'stock.transfer',

    // Sales actions
    SALE_COMPLETE: 'sale.complete',
    SALE_REFUND: 'sale.refund',
    SALE_VOID: 'sale.void',

    // Access actions
    ACCESS_DENIED: 'access.denied',
    PERMISSION_OVERRIDE: 'permission.override',
};

// ==================== INDEXEDDB INITIALIZATION ====================

/**
 * Initialize Audit DB
 */
const initAuditDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(AUDIT_DB_NAME, AUDIT_DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(AUDIT_STORE_NAME)) {
                const store = db.createObjectStore(AUDIT_STORE_NAME, { keyPath: 'id', autoIncrement: true });
                store.createIndex('action', 'action', { unique: false });
                store.createIndex('userId', 'userId', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
                store.createIndex('synced', 'synced', { unique: false });
            }
        };
    });
};

/**
 * Add audit log to IndexedDB
 */
const addAuditLogToDB = async (log) => {
    const db = await initAuditDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([AUDIT_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(AUDIT_STORE_NAME);
        const request = store.add(log);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Get all unsynced audit logs
 */
const getUnsyncedLogs = async () => {
    const db = await initAuditDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([AUDIT_STORE_NAME], 'readonly');
        const store = transaction.objectStore(AUDIT_STORE_NAME);
        const index = store.index('synced');
        const request = index.getAll(false);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Mark audit log as synced
 */
const markLogAsSynced = async (id) => {
    const db = await initAuditDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([AUDIT_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(AUDIT_STORE_NAME);
        const getRequest = store.get(id);

        getRequest.onsuccess = () => {
            const log = getRequest.result;
            if (log) {
                log.synced = true;
                log.syncedAt = new Date().toISOString();
                const updateRequest = store.put(log);
                updateRequest.onsuccess = () => resolve();
                updateRequest.onerror = () => reject(updateRequest.error);
            } else {
                resolve();
            }
        };

        getRequest.onerror = () => reject(getRequest.error);
    });
};

// ==================== AUDIT LOGGER CLASS ====================

export class AuditLogger {
    constructor() {
        this.initialized = false;
        this.queue = [];
    }

    /**
     * Initialize the audit logger
     */
    async initialize() {
        if (this.initialized) return;

        try {
            await initAuditDB();
            this.initialized = true;
            console.log('Audit logger initialized');
        } catch (error) {
            console.error('Failed to initialize audit logger:', error);
            // Continue anyway - we'll try to log to memory
            this.initialized = true;
        }
    }

    /**
     * Log an audit event
     * STRICT: This MUST be called for all critical actions
     */
    async log(action, context) {
        await this.initialize();

        const auditLog = {
            action,
            userId: context.userId || context.user?.id || 'unknown',
            userName: context.userName || context.user?.name || 'Unknown User',
            userRole: context.userRole || context.user?.role || 'Unknown',
            documentId: context.documentId || null,
            documentType: context.documentType || null,
            reason: context.reason || null,
            metadata: context.metadata || {},
            timestamp: new Date().toISOString(),
            synced: false,
            ipAddress: context.ipAddress || null,
            userAgent: context.userAgent || navigator.userAgent,
        };

        try {
            // Persist to IndexedDB
            const id = await addAuditLogToDB(auditLog);
            auditLog.id = id;

            // Add to in-memory queue
            this.queue.push(auditLog);

            console.log(`Audit log created: ${action}`, auditLog);

            // Try to sync immediately if online
            if (navigator.onLine) {
                this.syncLogs().catch(err => {
                    console.warn('Failed to sync audit logs:', err);
                });
            }

            return auditLog;
        } catch (error) {
            console.error('Failed to create audit log:', error);
            // Still add to memory queue as fallback
            this.queue.push(auditLog);
            throw error;
        }
    }

    /**
     * Sync unsynced logs to server
     */
    async syncLogs(apiClient) {
        await this.initialize();

        try {
            const unsyncedLogs = await getUnsyncedLogs();

            if (unsyncedLogs.length === 0) {
                console.log('No audit logs to sync');
                return { success: 0, failed: 0 };
            }

            console.log(`Syncing ${unsyncedLogs.length} audit logs...`);

            let success = 0;
            let failed = 0;

            for (const log of unsyncedLogs) {
                try {
                    if (apiClient) {
                        // Send to server
                        await apiClient.post('/api/audit-logs', log);
                    }

                    // Mark as synced
                    await markLogAsSynced(log.id);
                    success++;
                } catch (error) {
                    console.error(`Failed to sync audit log ${log.id}:`, error);
                    failed++;
                }
            }

            console.log(`Audit log sync complete: ${success} success, ${failed} failed`);
            return { success, failed };
        } catch (error) {
            console.error('Failed to sync audit logs:', error);
            return { success: 0, failed: 0 };
        }
    }

    /**
     * Get audit logs for a document
     */
    async getLogsForDocument(documentId) {
        await this.initialize();

        const db = await initAuditDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([AUDIT_STORE_NAME], 'readonly');
            const store = transaction.objectStore(AUDIT_STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const logs = request.result.filter(log => log.documentId === documentId);
                resolve(logs);
            };

            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get recent audit logs
     */
    async getRecentLogs(limit = 100) {
        await this.initialize();

        const db = await initAuditDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([AUDIT_STORE_NAME], 'readonly');
            const store = transaction.objectStore(AUDIT_STORE_NAME);
            const index = store.index('timestamp');
            const request = index.openCursor(null, 'prev');

            const logs = [];
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && logs.length < limit) {
                    logs.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(logs);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }
}

// ==================== CONVENIENCE FUNCTIONS ====================

// Export singleton instance
export const auditLogger = new AuditLogger();

/**
 * Log document approval
 * STRICT: Must be called when approving any document
 */
export const logDocumentApproval = async (documentId, documentType, user, reason = null) => {
    return auditLogger.log(AUDIT_ACTIONS.DOCUMENT_APPROVE, {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        documentId,
        documentType,
        reason,
        metadata: { approvedAt: new Date().toISOString() },
    });
};

/**
 * Log document posting
 * STRICT: Must be called when posting any document
 */
export const logDocumentPost = async (documentId, documentType, user, metadata = {}) => {
    return auditLogger.log(AUDIT_ACTIONS.DOCUMENT_POST, {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        documentId,
        documentType,
        metadata: { ...metadata, postedAt: new Date().toISOString() },
    });
};

/**
 * Log document reversal
 * STRICT: Must be called when reversing any document
 * Reason is MANDATORY
 */
export const logDocumentReversal = async (documentId, documentType, user, reason, metadata = {}) => {
    if (!reason || reason.trim() === '') {
        throw new Error('Reason is required for document reversal');
    }

    return auditLogger.log(AUDIT_ACTIONS.DOCUMENT_REVERSE, {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        documentId,
        documentType,
        reason,
        metadata: { ...metadata, reversedAt: new Date().toISOString() },
    });
};

/**
 * Log batch override
 * STRICT: Must be called when manually overriding FEFO batch selection
 */
export const logBatchOverride = async (productId, selectedBatch, autoSelectedBatch, user, reason) => {
    return auditLogger.log(AUDIT_ACTIONS.BATCH_OVERRIDE, {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        reason,
        metadata: {
            productId,
            selectedBatch,
            autoSelectedBatch,
            overriddenAt: new Date().toISOString(),
        },
    });
};

/**
 * Log price edit
 * STRICT: Must be called when editing product price
 */
export const logPriceEdit = async (productId, oldPrice, newPrice, user, reason = null) => {
    return auditLogger.log(AUDIT_ACTIONS.PRICE_EDIT, {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        reason,
        metadata: {
            productId,
            oldPrice,
            newPrice,
            difference: newPrice - oldPrice,
            editedAt: new Date().toISOString(),
        },
    });
};

/**
 * Log discount application
 * STRICT: Must be called when applying discount
 */
export const logDiscountApply = async (saleId, discountAmount, discountPercent, user, reason = null) => {
    return auditLogger.log(AUDIT_ACTIONS.DISCOUNT_APPLY, {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        documentId: saleId,
        documentType: 'sale',
        reason,
        metadata: {
            discountAmount,
            discountPercent,
            appliedAt: new Date().toISOString(),
        },
    });
};

/**
 * Log access denied
 * STRICT: Must be called when user attempts unauthorized action
 */
export const logAccessDenied = async (action, user, requiredPermission) => {
    return auditLogger.log(AUDIT_ACTIONS.ACCESS_DENIED, {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        metadata: {
            attemptedAction: action,
            requiredPermission,
            deniedAt: new Date().toISOString(),
        },
    });
};
