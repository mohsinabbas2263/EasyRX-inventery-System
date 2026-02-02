import React, { useState, useEffect } from "react";
import { X, Package, Tag, DollarSign, Calendar, Barcode, Building2, User, AlertCircle } from "lucide-react";

const CATEGORIES = ["Analgesics", "Gastrointestinal", "Antihistamines", "Antibiotics", "Antidiabetic", "Electrolytes", "Vitamins", "Other"];
const UNITS = ["Tablets", "Capsules", "Syrup", "Injection", "Sachets", "Bottles", "Boxes"];

export default function ProductModal({ product, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: "",
        genericName: "",
        category: "Analgesics",
        manufacturer: "",
        sku: "",
        barcode: "",
        price: "",
        costPrice: "",
        stock: "",
        minStock: "",
        maxStock: "",
        unit: "Tablets",
        status: "active",
        batch: "",
        expiryDate: "",
        lastRestocked: new Date().toISOString().split("T")[0],
        supplier: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (product) {
            setFormData(product);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.genericName.trim()) newErrors.genericName = "Generic name is required";
        if (!formData.sku.trim()) newErrors.sku = "SKU is required";
        if (!formData.barcode.trim()) newErrors.barcode = "Barcode is required";
        if (!formData.manufacturer.trim()) newErrors.manufacturer = "Manufacturer is required";
        if (!formData.supplier.trim()) newErrors.supplier = "Supplier is required";

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = "Price must be greater than 0";
        }
        if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) {
            newErrors.costPrice = "Cost price must be greater than 0";
        }
        if (parseFloat(formData.costPrice) > parseFloat(formData.price)) {
            newErrors.costPrice = "Cost price cannot be greater than selling price";
        }

        if (!formData.stock || parseInt(formData.stock) < 0) {
            newErrors.stock = "Stock must be 0 or greater";
        }
        if (!formData.minStock || parseInt(formData.minStock) <= 0) {
            newErrors.minStock = "Minimum stock must be greater than 0";
        }
        if (!formData.maxStock || parseInt(formData.maxStock) <= 0) {
            newErrors.maxStock = "Maximum stock must be greater than 0";
        }
        if (parseInt(formData.minStock) >= parseInt(formData.maxStock)) {
            newErrors.maxStock = "Maximum stock must be greater than minimum stock";
        }

        if (!formData.batch.trim()) newErrors.batch = "Batch number is required";
        if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Convert numeric fields
            const dataToSave = {
                ...formData,
                price: parseFloat(formData.price),
                costPrice: parseFloat(formData.costPrice),
                stock: parseInt(formData.stock),
                minStock: parseInt(formData.minStock),
                maxStock: parseInt(formData.maxStock),
            };
            onSave(dataToSave);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-primary-50 to-primary-100/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {product ? "Edit Product" : "Add New Product"}
                            </h2>
                            <p className="text-sm text-slate-600 mt-0.5">
                                {product ? "Update product information" : "Enter product details"}
                            </p>
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
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary-600" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.name ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="e.g., Paracetamol 500mg"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Generic Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="genericName"
                                        value={formData.genericName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.genericName ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="e.g., Acetaminophen"
                                    />
                                    {errors.genericName && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.genericName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Unit <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                                    >
                                        {UNITS.map((unit) => (
                                            <option key={unit} value={unit}>
                                                {unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Manufacturer <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="manufacturer"
                                        value={formData.manufacturer}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.manufacturer ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="e.g., GSK"
                                    />
                                    {errors.manufacturer && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.manufacturer}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Supplier <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="supplier"
                                        value={formData.supplier}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.supplier ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="e.g., Pharma Distributors Ltd"
                                    />
                                    {errors.supplier && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.supplier}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Identification */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Barcode className="h-4 w-4 text-primary-600" />
                                Identification
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        SKU <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.sku ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="e.g., MED-001"
                                    />
                                    {errors.sku && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.sku}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Barcode <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="barcode"
                                        value={formData.barcode}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.barcode ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="e.g., 8901234567890"
                                    />
                                    {errors.barcode && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.barcode}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Batch Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="batch"
                                        value={formData.batch}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.batch ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="e.g., B2401"
                                    />
                                    {errors.batch && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.batch}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Expiry Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.expiryDate ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                    />
                                    {errors.expiryDate && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.expiryDate}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-primary-600" />
                                Pricing
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Cost Price (PKR) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="costPrice"
                                        value={formData.costPrice}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.costPrice ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="0.00"
                                    />
                                    {errors.costPrice && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.costPrice}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Selling Price (PKR) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.price ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="0.00"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.price}
                                        </p>
                                    )}
                                </div>

                                {formData.price && formData.costPrice && (
                                    <div className="md:col-span-2">
                                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                                            <p className="text-sm font-medium text-blue-900">
                                                Profit Margin:{" "}
                                                <span className="font-bold">
                                                    PKR {(parseFloat(formData.price) - parseFloat(formData.costPrice)).toFixed(2)}
                                                </span>{" "}
                                                ({(((parseFloat(formData.price) - parseFloat(formData.costPrice)) / parseFloat(formData.costPrice)) * 100).toFixed(1)}%)
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inventory */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary-600" />
                                Inventory Levels
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Current Stock <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.stock ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="0"
                                    />
                                    {errors.stock && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.stock}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Minimum Stock <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="minStock"
                                        value={formData.minStock}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.minStock ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="0"
                                    />
                                    {errors.minStock && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.minStock}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Maximum Stock <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="maxStock"
                                        value={formData.maxStock}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 rounded-lg border ${errors.maxStock ? "border-red-300 focus:ring-red-500/20" : "border-slate-200 focus:ring-primary-500/20"
                                            } focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="0"
                                    />
                                    {errors.maxStock && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.maxStock}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                        >
                            {product ? "Update Product" : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
