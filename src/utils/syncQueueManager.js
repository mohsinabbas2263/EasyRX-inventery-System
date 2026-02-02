/**
 * Offline Sync Queue with IndexedDB Persistence
 * 
 * STRICT COMPLIANCE:
 * - Persists queue to IndexedDB (not just in-memory)
 * - Implements idempotency keys for safe retries
 * - Enforces sync ordering (inbound stock before outbound)
 * - Real sync calls with proper error handling
 */

const DB_NAME = 'eazyrx_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'sync_queue';

// ==================== SYNC PRIORITY ====================
/**
 * Sync priority order (higher number = higher priority)
 * Inbound stock (GRN/Purchase) syncs before outbound (Sales/Adjustments)
 */
export const SYNC_PRIORITY = {
    GRN: 100,           // Highest - inbound stock
    PURCHASE: 100,      // Highest - inbound stock
    TRANSFER_IN: 90,    // High - inbound transfer
    ADJUSTMENT_IN: 85,  // High - stock increase
    SALE: 50,           // Medium - outbound (revenue-impacting)
    TRANSFER_OUT: 40,   // Medium-low - outbound transfer
    ADJUSTMENT_OUT: 30, // Low - stock decrease
};

/**
 * Get sync priority for a transaction type
 */
export const getSyncPriority = (type) => {
    return SYNC_PRIORITY[type.toUpperCase()] || 0;
};

// ==================== INDEXEDDB UTILITIES ====================

/**
 * Initialize IndexedDB
 */
const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create sync queue store if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('status', 'status', { unique: false });
                store.createIndex('priority', 'priority', { unique: false });
                store.createIndex('createdAt', 'createdAt', { unique: false });
            }
        };
    });
};

/**
 * Add item to IndexedDB
 */
const addToIndexedDB = async (item) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Update item in IndexedDB
 */
const updateInIndexedDB = async (item) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Remove item from IndexedDB
 */
const removeFromIndexedDB = async (id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

/**
 * Get all items from IndexedDB
 */
const getAllFromIndexedDB = async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// ==================== IDEMPOTENCY KEY GENERATION ====================

/**
 * Generate idempotency key for a transaction
 * Format: {type}_{timestamp}_{randomId}
 */
export const generateIdempotencyKey = (type, data) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    return `${type}_${timestamp}_${randomId}`;
};

// ==================== SYNC QUEUE MANAGER ====================

export class SyncQueueManager {
    constructor() {
        this.queue = [];
        this.isInitialized = false;
    }

    /**
     * Initialize the sync queue from IndexedDB
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            this.queue = await getAllFromIndexedDB();
            this.isInitialized = true;
            console.log(`Sync queue initialized with ${this.queue.length} items`);
        } catch (error) {
            console.error('Failed to initialize sync queue:', error);
            this.queue = [];
            this.isInitialized = true;
        }
    }

    /**
     * Add transaction to sync queue
     */
    async addToQueue(transaction) {
        await this.initialize();

        const queueItem = {
            id: transaction.id || generateIdempotencyKey(transaction.type, transaction.data),
            idempotencyKey: generateIdempotencyKey(transaction.type, transaction.data),
            type: transaction.type,
            data: transaction.data,
            status: 'pending',
            priority: getSyncPriority(transaction.type),
            createdAt: new Date().toISOString(),
            attempts: 0,
            lastError: null,
            lastAttempt: null,
        };

        try {
            await addToIndexedDB(queueItem);
            this.queue.push(queueItem);
            console.log(`Added to sync queue: ${queueItem.id}`);
            return queueItem.id;
        } catch (error) {
            console.error('Failed to add to sync queue:', error);
            throw error;
        }
    }

    /**
     * Update sync status
     */
    async updateStatus(id, status, error = null) {
        await this.initialize();

        const item = this.queue.find(i => i.id === id);
        if (!item) {
            console.warn(`Item not found in queue: ${id}`);
            return;
        }

        item.status = status;
        item.lastError = error;
        item.attempts += 1;
        item.lastAttempt = new Date().toISOString();

        try {
            await updateInIndexedDB(item);
            console.log(`Updated sync status: ${id} -> ${status}`);
        } catch (error) {
            console.error('Failed to update sync status:', error);
        }
    }

    /**
     * Remove from sync queue
     */
    async removeFromQueue(id) {
        await this.initialize();

        try {
            await removeFromIndexedDB(id);
            this.queue = this.queue.filter(item => item.id !== id);
            console.log(`Removed from sync queue: ${id}`);
        } catch (error) {
            console.error('Failed to remove from sync queue:', error);
        }
    }

    /**
     * Get sync queue stats
     */
    getStats() {
        const pending = this.queue.filter(item => item.status === 'pending').length;
        const synced = this.queue.filter(item => item.status === 'synced').length;
        const failed = this.queue.filter(item => item.status === 'failed').length;
        const exception = this.queue.filter(item => item.status === 'exception').length;

        return { pending, synced, failed, exception, total: this.queue.length };
    }

    /**
     * Get pending items sorted by priority
     * STRICT: Inbound stock (GRN/Purchase) syncs before outbound (Sales)
     */
    getPendingItems() {
        return this.queue
            .filter(item => item.status === 'pending' || item.status === 'failed')
            .sort((a, b) => {
                // Sort by priority (descending), then by createdAt (ascending)
                if (b.priority !== a.priority) {
                    return b.priority - a.priority;
                }
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
    }

    /**
     * Sync all pending items
     * STRICT: Respects priority ordering
     */
    async syncAll(apiClient) {
        await this.initialize();

        const pendingItems = this.getPendingItems();
        console.log(`Syncing ${pendingItems.length} items...`);

        const results = {
            success: 0,
            failed: 0,
            errors: [],
        };

        for (const item of pendingItems) {
            try {
                // Call API with idempotency key
                await this.syncItem(item, apiClient);
                await this.updateStatus(item.id, 'synced');
                results.success++;
            } catch (error) {
                console.error(`Failed to sync item ${item.id}:`, error);

                // Check if it's a permanent failure or temporary
                if (error.status === 409 || error.status === 400) {
                    // Conflict or bad request - mark as exception
                    await this.updateStatus(item.id, 'exception', error.message);
                } else {
                    // Temporary failure - mark as failed for retry
                    await this.updateStatus(item.id, 'failed', error.message);
                }

                results.failed++;
                results.errors.push({ id: item.id, error: error.message });
            }
        }

        console.log(`Sync complete: ${results.success} success, ${results.failed} failed`);
        return results;
    }

    /**
     * Sync a single item
     */
    async syncItem(item, apiClient) {
        if (!apiClient) {
            throw new Error('API client not provided');
        }

        const endpoint = this.getEndpointForType(item.type);

        // Make API call with idempotency key in header
        const response = await apiClient.post(endpoint, item.data, {
            headers: {
                'Idempotency-Key': item.idempotencyKey,
            },
        });

        return response.data;
    }

    /**
     * Get API endpoint for transaction type
     */
    getEndpointForType(type) {
        const endpoints = {
            sale: '/api/sales',
            grn: '/api/grn',
            purchase: '/api/purchases',
            transfer: '/api/transfers',
            adjustment: '/api/adjustments',
        };

        return endpoints[type.toLowerCase()] || '/api/transactions';
    }

    /**
     * Clear synced items (older than 7 days)
     */
    async clearOldSyncedItems() {
        await this.initialize();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const itemsToRemove = this.queue.filter(item =>
            item.status === 'synced' &&
            new Date(item.createdAt) < sevenDaysAgo
        );

        for (const item of itemsToRemove) {
            await this.removeFromQueue(item.id);
        }

        console.log(`Cleared ${itemsToRemove.length} old synced items`);
    }
}

// Export singleton instance
export const syncQueueManager = new SyncQueueManager();
