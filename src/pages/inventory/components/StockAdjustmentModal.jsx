import React, { useState } from "react";
import { X, Package, Plus, Minus, AlertCircle, Calendar, MapPin } from "lucide-react";

export default function StockAdjustmentModal({ product, onClose, onSave }) {
    const [adjustmentType, setAdjustmentType] = useState("add");
    const [formData, setFormData] = useState({
        quantity: "",
        batchNo: "",
        expiryDate: "",
        location: "",
        reason: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.quantity || parseInt(formData.quantity) <= 0) {
            newErrors.quantity = "Quantity must be greater than 0";
        }

        if (adjustmentType === "add") {
            if (!formData.batchNo.trim()) newErrors.batchNo = "Batch number is required";
            if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
            if (!formData.location.trim()) newErrors.location = "Location is required";
        }

        if (!formData.reason.trim()) newErrors.reason = "Reason is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const quantity = parseInt(formData.quantity);
            const adjustedQuantity = adjustmentType === "add" ? quantity : -quantity;

            // Determine batch status based on expiry date
            let status = "good";
            if (adjustmentType === "add" && formData.expiryDate) {
                const expiryDate = new Date(formData.expiryDate);
                const today = new Date();
                const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

                if (daysUntilExpiry < 0) {
                    status = "expired";
                } else if (daysUntilExpiry <= 60) {
                    status = "expiring_soon";
                }
            }

            onSave({
                quantity: adjustedQuantity,
                batch: adjustmentType === "add" ? {
                    batchNo: formData.batchNo,
                    qty: quantity,
                    expiryDate: formData.expiryDate,
                    location: formData.location,
                    status: status,
                } : null,
                reason: formData.reason,
                type: adjustmentType,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-primary-50 to-primary-100/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Stock Adjustment</h2>
                            <p className="text-sm text-slate-600 mt-0.5">{product?.productName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/50 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Current Stock Info */}
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-900">Current Stock</p>
                                <p className="text-2xl font-bold text-blue-700 mt-1">{product?.totalStock}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-blue-900">Minimum Stock</p>
                                <p className="text-2xl font-bold text-blue-700 mt-1">{product?.minStock}</p>
                            </div>
                        </div>
                    </div>

                    {/* Adjustment Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Adjustment Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setAdjustmentType("add")}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${adjustmentType === "add"
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                <Plus className="h-5 w-5" />
                                <span className="font-semibold">Add Stock</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAdjustmentType("remove")}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${adjustmentType === "remove"
                                        ? "border-red-500 bg-red-50 text-red-700"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                <Minus className="h-5 w-5" />
                                <span className="font-semibold">Remove Stock</span>
                            </button>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className={`w-full px-3 py-2.5 rounded-lg border ${errors.quantity ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                } focus:outline-none focus:ring-2 transition-colors`}
                            placeholder="Enter quantity"
                        />
                        {errors.quantity && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.quantity}
                            </p>
                        )}
                    </div>

                    {/* Batch Details (only for adding stock) */}
                    {adjustmentType === "add" && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Batch Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="batchNo"
                                        value={formData.batchNo}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.batchNo ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="e.g., B2401"
                                    />
                                    {errors.batchNo && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.batchNo}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Expiry Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="date"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-3 py-2.5 rounded-lg border ${errors.expiryDate ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                                } focus:outline-none focus:ring-2 transition-colors`}
                                        />
                                    </div>
                                    {errors.expiryDate && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.expiryDate}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Storage Location <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2.5 rounded-lg border ${errors.location ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="e.g., Shelf A1"
                                    />
                                </div>
                                {errors.location && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.location}
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Reason for Adjustment <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows={3}
                            className={`w-full px-3 py-2.5 rounded-lg border ${errors.reason ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                } focus:outline-none focus:ring-2 transition-colors resize-none`}
                            placeholder="Enter reason for stock adjustment..."
                        />
                        {errors.reason && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.reason}
                            </p>
                        )}
                    </div>

                    {/* Preview */}
                    {formData.quantity && (
                        <div className={`rounded-lg border-2 p-4 ${adjustmentType === "add"
                                ? "border-emerald-200 bg-emerald-50"
                                : "border-red-200 bg-red-50"
                            }`}>
                            <p className="text-sm font-medium text-slate-700 mb-2">Preview:</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Current Stock:</span>
                                <span className="text-sm font-semibold text-slate-900">{product?.totalStock}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-sm text-slate-600">Adjustment:</span>
                                <span className={`text-sm font-semibold ${adjustmentType === "add" ? "text-emerald-700" : "text-red-700"
                                    }`}>
                                    {adjustmentType === "add" ? "+" : "-"}{formData.quantity}
                                </span>
                            </div>
                            <div className="border-t border-slate-300 mt-2 pt-2 flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">New Stock:</span>
                                <span className="text-lg font-bold text-slate-900">
                                    {adjustmentType === "add"
                                        ? product?.totalStock + parseInt(formData.quantity || 0)
                                        : product?.totalStock - parseInt(formData.quantity || 0)
                                    }
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-5 py-2.5 rounded-lg text-white text-sm font-bold shadow-lg transition-all ${adjustmentType === "add"
                                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
                                }`}
                        >
                            Confirm Adjustment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
