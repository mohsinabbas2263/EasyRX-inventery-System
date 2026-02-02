import React, { useState, useEffect } from "react";
import { X, Building2, User, Mail, Phone, MapPin, FileText, DollarSign, Calendar } from "lucide-react";

export default function SupplierModal({ supplier, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "Pakistan",
        taxNumber: "",
        paymentTerms: "Net 30",
        creditLimit: "",
        status: "Active",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name || "",
                contactPerson: supplier.contactPerson || "",
                email: supplier.email || "",
                phone: supplier.phone || "",
                address: supplier.address || "",
                city: supplier.city || "",
                country: supplier.country || "Pakistan",
                taxNumber: supplier.taxNumber || "",
                paymentTerms: supplier.paymentTerms || "Net 30",
                creditLimit: supplier.creditLimit || "",
                status: supplier.status || "Active",
            });
        }
    }, [supplier]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Supplier name is required";
        if (!formData.contactPerson.trim()) newErrors.contactPerson = "Contact person is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.taxNumber.trim()) newErrors.taxNumber = "Tax number is required";
        if (!formData.creditLimit || formData.creditLimit <= 0) {
            newErrors.creditLimit = "Credit limit must be greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {supplier ? "Edit Supplier" : "Add New Supplier"}
                                </h2>
                                <p className="text-sm text-primary-100 mt-0.5">
                                    {supplier ? "Update supplier information" : "Enter supplier details"}
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
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-primary-600" />
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Supplier Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? "border-red-300 bg-red-50" : "border-slate-200"
                                                } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                            placeholder="Enter supplier name"
                                        />
                                        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Contact Person <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.contactPerson}
                                            onChange={(e) => handleChange("contactPerson", e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.contactPerson ? "border-red-300 bg-red-50" : "border-slate-200"
                                                } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                            placeholder="Enter contact person name"
                                        />
                                        {errors.contactPerson && (
                                            <p className="text-xs text-red-600 mt-1">{errors.contactPerson}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary-600" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Mail className="inline h-3.5 w-3.5 mr-1" />
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? "border-red-300 bg-red-50" : "border-slate-200"
                                                } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                            placeholder="supplier@example.com"
                                        />
                                        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <Phone className="inline h-3.5 w-3.5 mr-1" />
                                            Phone <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleChange("phone", e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone ? "border-red-300 bg-red-50" : "border-slate-200"
                                                } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                            placeholder="+92 300 1234567"
                                        />
                                        {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary-600" />
                                    Address
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Street Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => handleChange("address", e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.address ? "border-red-300 bg-red-50" : "border-slate-200"
                                                } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                            placeholder="123 Main Street"
                                        />
                                        {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => handleChange("city", e.target.value)}
                                                className={`w-full px-4 py-2.5 rounded-lg border ${errors.city ? "border-red-300 bg-red-50" : "border-slate-200"
                                                    } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                                placeholder="Lahore"
                                            />
                                            {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                                            <input
                                                type="text"
                                                value={formData.country}
                                                onChange={(e) => handleChange("country", e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                                placeholder="Pakistan"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Business Details */}
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary-600" />
                                    Business Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Tax Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.taxNumber}
                                            onChange={(e) => handleChange("taxNumber", e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.taxNumber ? "border-red-300 bg-red-50" : "border-slate-200"
                                                } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                            placeholder="1234567-8"
                                        />
                                        {errors.taxNumber && <p className="text-xs text-red-600 mt-1">{errors.taxNumber}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Payment Terms
                                        </label>
                                        <select
                                            value={formData.paymentTerms}
                                            onChange={(e) => handleChange("paymentTerms", e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                        >
                                            <option value="Net 15">Net 15 Days</option>
                                            <option value="Net 30">Net 30 Days</option>
                                            <option value="Net 45">Net 45 Days</option>
                                            <option value="Net 60">Net 60 Days</option>
                                            <option value="COD">Cash on Delivery</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <DollarSign className="inline h-3.5 w-3.5 mr-1" />
                                            Credit Limit (PKR) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.creditLimit}
                                            onChange={(e) => handleChange("creditLimit", parseFloat(e.target.value))}
                                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.creditLimit ? "border-red-300 bg-red-50" : "border-slate-200"
                                                } focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors`}
                                            placeholder="500000"
                                            min="0"
                                        />
                                        {errors.creditLimit && (
                                            <p className="text-xs text-red-600 mt-1">{errors.creditLimit}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                            >
                                {supplier ? "Update Supplier" : "Add Supplier"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
