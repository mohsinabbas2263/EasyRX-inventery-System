import React from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useOfflineSync } from '../context/OfflineSyncContext';

/**
 * Offline Indicator Component
 * Shows online/offline status and sync queue information
 */
export const OfflineIndicator = ({ className = '' }) => {
    const { isOnline, syncQueue, syncStatus, getSyncStats, syncAll } = useOfflineSync();
    const stats = getSyncStats();

    const handleSync = () => {
        if (isOnline && stats.pending > 0) {
            syncAll();
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Online/Offline Status */}
            <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${isOnline
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                title={isOnline ? 'Online' : 'Offline - Changes will sync when online'}
            >
                {isOnline ? (
                    <Wifi className="h-3.5 w-3.5" />
                ) : (
                    <WifiOff className="h-3.5 w-3.5" />
                )}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Sync Queue Counter */}
            {stats.total > 0 && (
                <button
                    onClick={handleSync}
                    disabled={!isOnline || syncStatus === 'syncing'}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${stats.pending > 0
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            : stats.failed > 0 || stats.exception > 0
                                ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={`${stats.pending} pending, ${stats.synced} synced, ${stats.failed} failed, ${stats.exception} exceptions`}
                >
                    {syncStatus === 'syncing' ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : stats.failed > 0 || stats.exception > 0 ? (
                        <AlertCircle className="h-3.5 w-3.5" />
                    ) : stats.pending > 0 ? (
                        <Cloud className="h-3.5 w-3.5" />
                    ) : (
                        <CheckCircle className="h-3.5 w-3.5" />
                    )}
                    <span>
                        {stats.pending > 0 ? `${stats.pending} Pending` :
                            stats.failed > 0 ? `${stats.failed} Failed` :
                                stats.exception > 0 ? `${stats.exception} Exceptions` :
                                    'All Synced'}
                    </span>
                </button>
            )}
        </div>
    );
};

/**
 * Sync Status Badge Component
 * Shows sync status for individual transactions
 */
export const SyncStatusBadge = ({ status, className = '' }) => {
    const statusConfig = {
        pending: {
            label: 'Pending',
            color: 'bg-amber-100 text-amber-700 border-amber-200',
            icon: Cloud,
        },
        synced: {
            label: 'Synced',
            color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            icon: CheckCircle,
        },
        failed: {
            label: 'Failed',
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: CloudOff,
        },
        exception: {
            label: 'Exception',
            color: 'bg-orange-100 text-orange-700 border-orange-200',
            icon: AlertCircle,
        },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color} ${className}`}>
            <Icon className="h-3 w-3" />
            {config.label}
        </span>
    );
};

export default OfflineIndicator;
