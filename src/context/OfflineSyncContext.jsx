import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Offline/Sync Context
 * Manages offline state, sync queue, and network status
 */

const OfflineSyncContext = createContext(null);

export const OfflineSyncProvider = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncQueue, setSyncQueue] = useState([]);
    const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'success', 'error'

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Add transaction to sync queue
    const addToSyncQueue = (transaction) => {
        const queueItem = {
            id: transaction.id || `temp_${Date.now()}`,
            type: transaction.type,
            data: transaction.data,
            status: 'pending',
            createdAt: new Date().toISOString(),
            attempts: 0,
            lastError: null,
        };

        setSyncQueue((prev) => [...prev, queueItem]);
        return queueItem.id;
    };

    // Update sync queue item status
    const updateSyncStatus = (id, status, error = null) => {
        setSyncQueue((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        status,
                        lastError: error,
                        attempts: item.attempts + 1,
                        lastAttempt: new Date().toISOString(),
                    }
                    : item
            )
        );
    };

    // Remove from sync queue
    const removeFromSyncQueue = (id) => {
        setSyncQueue((prev) => prev.filter((item) => item.id !== id));
    };

    // Get sync queue stats
    const getSyncStats = () => {
        const pending = syncQueue.filter((item) => item.status === 'pending').length;
        const synced = syncQueue.filter((item) => item.status === 'synced').length;
        const failed = syncQueue.filter((item) => item.status === 'failed').length;
        const exception = syncQueue.filter((item) => item.status === 'exception').length;

        return { pending, synced, failed, exception, total: syncQueue.length };
    };

    // Sync all pending items
    const syncAll = async () => {
        if (!isOnline) {
            console.warn('Cannot sync while offline');
            return;
        }

        setSyncStatus('syncing');
        const pendingItems = syncQueue.filter((item) => item.status === 'pending' || item.status === 'failed');

        for (const item of pendingItems) {
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                updateSyncStatus(item.id, 'synced');
            } catch (error) {
                updateSyncStatus(item.id, 'failed', error.message);
            }
        }

        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 2000);
    };

    const value = {
        isOnline,
        syncQueue,
        syncStatus,
        addToSyncQueue,
        updateSyncStatus,
        removeFromSyncQueue,
        getSyncStats,
        syncAll,
    };

    return <OfflineSyncContext.Provider value={value}>{children}</OfflineSyncContext.Provider>;
};

export const useOfflineSync = () => {
    const context = useContext(OfflineSyncContext);
    if (!context) {
        throw new Error('useOfflineSync must be used within OfflineSyncProvider');
    }
    return context;
};
