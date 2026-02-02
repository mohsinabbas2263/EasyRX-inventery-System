import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function PermissionDenied({ role, requiredPermission }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
                        <ShieldAlert className="h-12 w-12 text-red-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Access Denied
                    </h1>
                    <p className="text-slate-600 mb-6">
                        You don't have permission to access this page.
                    </p>

                    {/* Role Info */}
                    {role && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-amber-800">
                                <span className="font-semibold">Current Role:</span> {role}
                            </p>
                            {requiredPermission && (
                                <p className="text-sm text-amber-800 mt-1">
                                    <span className="font-semibold">Required:</span> {requiredPermission}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Message */}
                    <p className="text-sm text-slate-500 mb-6">
                        Please contact your administrator if you believe you should have access to this page.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            Dashboard
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-500 mt-6">
                    EazyRX Pharmacy Management System
                </p>
            </div>
        </div>
    );
}
