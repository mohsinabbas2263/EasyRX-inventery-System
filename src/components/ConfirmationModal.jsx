import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

/**
 * Confirmation Modal Component
 * Used for confirming irreversible actions like posting, reversing, or deleting documents
 */
export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    requiresReason = false,
    type = 'warning', // 'warning', 'danger', 'info', 'success'
    isLoading = false,
}) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (requiresReason && !reason.trim()) {
            setError('Reason is required');
            return;
        }
        onConfirm(reason.trim());
    };

    const handleClose = () => {
        if (!isLoading) {
            setReason('');
            setError('');
            onClose();
        }
    };

    const typeConfig = {
        warning: {
            icon: AlertTriangle,
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-100',
            buttonColor: 'bg-amber-600 hover:bg-amber-700',
        },
        danger: {
            icon: AlertTriangle,
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            buttonColor: 'bg-red-600 hover:bg-red-700',
        },
        info: {
            icon: Info,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            buttonColor: 'bg-blue-600 hover:bg-blue-700',
        },
        success: {
            icon: CheckCircle,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-100',
            buttonColor: 'bg-emerald-600 hover:bg-emerald-700',
        },
    };

    const config = typeConfig[type] || typeConfig.warning;
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full ${config.iconBg} flex items-center justify-center`}>
                            <Icon className={`h-5 w-5 ${config.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-1 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    <p className="text-sm text-slate-600 mb-4">{message}</p>

                    {requiresReason && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter reason for this action..."
                                className={`w-full px-3 py-2 rounded-lg border ${error ? 'border-red-300' : 'border-slate-200'
                                    } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors resize-none`}
                                rows={3}
                                disabled={isLoading}
                            />
                            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-5 bg-slate-50 border-t border-slate-200">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg ${config.buttonColor} text-white text-sm font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
