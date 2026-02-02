import React, { useState, useEffect } from "react";
import { X, Package, FileText, Plus, Trash2, Calendar, Building2 } from "lucide-react";

const MOCK_SUPPLIERS = [
    "MediPharma Suppliers",
    "HealthCare Distributors",
    "Global Pharma Solutions",
    "QuickMed Supplies",
];

const MOCK_PRODUCTS = [
    "Paracetamol 500mg",
    "Omeprazole 20mg",
    "Cetirizine 10mg",
    "Metformin 500mg",
    "Amoxicillin 500mg",
    "Ibuprofen 400mg",
    "Azithromycin 250mg",
    "Losartan 50mg",
];

export default function GRNModal({ grn, onClose, onSave }) {
    const [formData, setFormData] = useState({
        grnNumber: "",
        poNumber: "",
        supplier: "",
        date: new Date().toISOString().split("T")[0],
        receivedBy: "Demo User",
        status: "Pending",
        items: [],
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (grn) {
            setFormData({
                grnNumber: grn.grnNumber || "",
                poNumber: grn.poNumber || "",
                supplier: grn.supplier || "",
                date: grn.date || new Date().toISOString().split("T")[0],
                receivedBy: grn.receivedBy || "Demo User",
                status: grn.status || "Pending",
                items: grn.items || [],
            });
        } else {
            // Generate new GRN number
            const newGRNNumber = `GRN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
            setFormData((prev) => ({ ...prev, grnNumber: newGRNNumber }));
        }
    }, [grn]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                {
                    product: "",
                    quantity: "",
                    rate: "",
                    amount: 0,
                    batch: "",
                    expiry: "",
                },
            ],
        });
    };

    const handleRemoveItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        // Auto-calculate amount
        if (field === "quantity" || field === "rate") {
            const quantity = parseFloat(newItems[index].quantity) || 0;
            const rate = parseFloat(newItems[index].rate) || 0;
            newItems[index].amount = quantity * rate;
        }

        setFormData({ ...formData, items: newItems });
    };

    const calculateTotals = () => {
        const totalItems = formData.items.length;
        const totalQuantity = formData.items.reduce(
            (sum, item) => sum + (parseFloat(item.quantity) || 0),
            0
        );
        const totalAmount = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);

        return { totalItems, totalQuantity, totalAmount };
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.poNumber.trim()) newErrors.poNumber = "PO Number is required";
        if (!formData.supplier) newErrors.supplier = "Supplier is required";
        if (!formData.date) newErrors.date = "Date is required";
        if (formData.items.length === 0) newErrors.items = "At least one item is required";

        // Validate each item
        formData.items.forEach((item, index) => {
            if (!item.product) newErrors[`item_${index}_product`] = "Product is required";
            if (!item.quantity || item.quantity <= 0)
                newErrors[`item_${index}_quantity`] = "Valid quantity required";
            if (!item.rate || item.rate <= 0) newErrors[`item_${index}_rate`] = "Valid rate required";
            if (!item.batch) newErrors[`item_${index}_batch`] = "Batch number required";
            if (!item.expiry) newErrors[`item_${index}_expiry`] = "Expiry date required";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const totals = calculateTotals();
            onSave({ ...formData, ...totals });
        }
    };

    const totals = calculateTotals();
    const isViewMode = grn && grn.status !== "Pending";

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {isViewMode ? "View GRN" : grn ? "Edit GRN" : "Create New GRN"}
                                </h2>
                                <p className="text-sm text-primary-100 mt-0.5">
                                    {isViewMode ? "GRN Details" : "Goods Receipt Note"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-6">
                            {/* GRN Header Information */}
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary-600" />
                                    GRN Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            GRN Number
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.grnNumber}
                                            disabled
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            PO Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.poNumber}
                                            onChange={(e) => handleChange("poNumber", e.target.value)}
                                            disabled={isViewMode}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.poNumber ? "border-red-300 bg-red-50" : "border-slate-200"
                                                } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : ""
                                                } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                            placeholder="PO-2026-001"
                                        />
                                        {errors.poNumber && <p className="text-xs text-red-600 mt-1">{errors.poNumber}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => handleChange("date", e.target.value)}
                                            disabled={isViewMode}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.date ? "border-red-300 bg-red-50" : "border-slate-200"
                                                } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : ""
                                                } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                        />
                                        {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Building2 className="inline h-3.5 w-3.5 mr-1" />
                                            Supplier <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.supplier}
                                            onChange={(e) => handleChange("supplier", e.target.value)}
                                            disabled={isViewMode}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.supplier ? "border-red-300 bg-red-50" : "border-slate-200"
                                                } ${isViewMode ? "bg-slate-50 cursor-not-allowed" : ""
                                                } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                        >
                                            <option value="">Select Supplier</option>
                                            {MOCK_SUPPLIERS.map((supplier) => (
                                                <option key={supplier} value={supplier}>
                                                    {supplier}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.supplier && <p className="text-xs text-red-600 mt-1">{errors.supplier}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Received By
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.receivedBy}
                                            disabled
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                            disabled={!grn || isViewMode}
                                            className={`w-full px-4 py-2.5 rounded-lg border border-slate-200 ${!grn || isViewMode ? "bg-slate-50 cursor-not-allowed" : ""
                                                } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                                        <Package className="h-4 w-4 text-primary-600" />
                                        Items
                                    </h3>
                                    {!isViewMode && (
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-semibold transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Item
                                        </button>
                                    )}
                                </div>

                                {errors.items && <p className="text-sm text-red-600 mb-3">{errors.items}</p>}

                                <div className="space-y-3">
                                    {formData.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold text-slate-700">Item #{index + 1}</span>
                                                {!isViewMode && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        Product <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        value={item.product}
                                                        onChange={(e) => handleItemChange(index, "product", e.target.value)}
                                                        disabled={isViewMode}
                                                        className={`w-full px-3 py-2 rounded-lg border text-sm ${errors[`item_${index}_product`]
                                                                ? "border-red-300 bg-red-50"
                                                                : "border-slate-200 bg-white"
                                                            } ${isViewMode ? "bg-slate-100 cursor-not-allowed" : ""
                                                            } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
                                                    >
                                                        <option value="">Select Product</option>
                                                        {MOCK_PRODUCTS.map((product) => (
                                                            <option key={product} value={product}>
                                                                {product}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        Quantity <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                                        disabled={isViewMode}
                                                        className={`w-full px-3 py-2 rounded-lg border text-sm ${errors[`item_${index}_quantity`]
                                                                ? "border-red-300 bg-red-50"
                                                                : "border-slate-200 bg-white"
                                                            } ${isViewMode ? "bg-slate-100 cursor-not-allowed" : ""
                                                            } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
                                                        placeholder="0"
                                                        min="0"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        Rate (PKR) <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.rate}
                                                        onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                                                        disabled={isViewMode}
                                                        className={`w-full px-3 py-2 rounded-lg border text-sm ${errors[`item_${index}_rate`]
                                                                ? "border-red-300 bg-red-50"
                                                                : "border-slate-200 bg-white"
                                                            } ${isViewMode ? "bg-slate-100 cursor-not-allowed" : ""
                                                            } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
                                                        placeholder="0.00"
                                                        min="0"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        Batch <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.batch}
                                                        onChange={(e) => handleItemChange(index, "batch", e.target.value)}
                                                        disabled={isViewMode}
                                                        className={`w-full px-3 py-2 rounded-lg border text-sm ${errors[`item_${index}_batch`]
                                                                ? "border-red-300 bg-red-50"
                                                                : "border-slate-200 bg-white"
                                                            } ${isViewMode ? "bg-slate-100 cursor-not-allowed" : ""
                                                            } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
                                                        placeholder="B2401"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        Expiry <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={item.expiry}
                                                        onChange={(e) => handleItemChange(index, "expiry", e.target.value)}
                                                        disabled={isViewMode}
                                                        className={`w-full px-3 py-2 rounded-lg border text-sm ${errors[`item_${index}_expiry`]
                                                                ? "border-red-300 bg-red-50"
                                                                : "border-slate-200 bg-white"
                                                            } ${isViewMode ? "bg-slate-100 cursor-not-allowed" : ""
                                                            } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-200">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    Amount: <span className="text-primary-600">PKR {item.amount.toFixed(2)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {formData.items.length === 0 && (
                                        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                                            <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-sm text-slate-500">No items added yet</p>
                                            {!isViewMode && (
                                                <button
                                                    type="button"
                                                    onClick={handleAddItem}
                                                    className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                                                >
                                                    + Add your first item
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Totals */}
                            {formData.items.length > 0 && (
                                <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs font-medium text-primary-700 mb-1">Total Items</p>
                                            <p className="text-xl font-bold text-primary-900">{totals.totalItems}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-primary-700 mb-1">Total Quantity</p>
                                            <p className="text-xl font-bold text-primary-900">{totals.totalQuantity}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-primary-700 mb-1">Total Amount</p>
                                            <p className="text-xl font-bold text-primary-900">
                                                PKR {totals.totalAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors"
                            >
                                {isViewMode ? "Close" : "Cancel"}
                            </button>
                            {!isViewMode && (
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                                >
                                    {grn ? "Update GRN" : "Create GRN"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
