import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    ChevronDown,
    Plus,
    Search,
    Filter,
    Download,
    Upload,
    Edit,
    Trash2,
    Phone,
    Mail,
    MapPin,
    TrendingUp,
    TrendingDown,
    Building2,
    Package,
    DollarSign,
    Calendar,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
} from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import SupplierModal from "./components/SupplierModal";
import { THEME } from "../../theme";

// Mock Suppliers Data
const MOCK_SUPPLIERS = [
    {
        id: 1,
        name: "MediPharma Suppliers",
        contactPerson: "Ali Ahmed",
        email: "ali@medipharma.com",
        phone: "+92 300 1234567",
        address: "123 Medical Plaza, Lahore",
        city: "Lahore",
        country: "Pakistan",
        taxNumber: "1234567-8",
        paymentTerms: "Net 30",
        creditLimit: 500000,
        currentBalance: 125000,
        status: "Active",
        totalPurchases: 2450000,
        lastPurchase: "2026-01-25",
        productsSupplied: 45,
    },
    {
        id: 2,
        name: "HealthCare Distributors",
        contactPerson: "Fatima Khan",
        email: "fatima@healthcare.com",
        phone: "+92 321 9876543",
        address: "456 Health Street, Karachi",
        city: "Karachi",
        country: "Pakistan",
        taxNumber: "9876543-2",
        paymentTerms: "Net 15",
        creditLimit: 300000,
        currentBalance: 85000,
        status: "Active",
        totalPurchases: 1850000,
        lastPurchase: "2026-01-26",
        productsSupplied: 32,
    },
    {
        id: 3,
        name: "Global Pharma Solutions",
        contactPerson: "Hassan Raza",
        email: "hassan@globalpharma.com",
        phone: "+92 333 5555555",
        address: "789 Trade Center, Islamabad",
        city: "Islamabad",
        country: "Pakistan",
        taxNumber: "5555555-5",
        paymentTerms: "Net 45",
        creditLimit: 750000,
        currentBalance: 0,
        status: "Active",
        totalPurchases: 3200000,
        lastPurchase: "2026-01-20",
        productsSupplied: 67,
    },
    {
        id: 4,
        name: "QuickMed Supplies",
        contactPerson: "Ayesha Malik",
        email: "ayesha@quickmed.com",
        phone: "+92 345 7777777",
        address: "321 Commerce Road, Faisalabad",
        city: "Faisalabad",
        country: "Pakistan",
        taxNumber: "7777777-7",
        paymentTerms: "Net 30",
        creditLimit: 200000,
        currentBalance: 150000,
        status: "Inactive",
        totalPurchases: 950000,
        lastPurchase: "2025-12-15",
        productsSupplied: 28,
    },
];

export default function Suppliers() {
    const navigate = useNavigate();
    const [demoRole, setDemoRole] = useState("Admin");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const roleBadge = useMemo(() => {
        if (demoRole === "Admin")
            return { label: "Admin • Full Access", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
        if (demoRole === "Pharmacist")
            return { label: "Pharmacist • Limited Access", cls: "bg-blue-50 text-blue-700 border-blue-200" };
        return { label: "Cashier • Limited Access", cls: "bg-amber-50 text-amber-700 border-amber-200" };
    }, [demoRole]);

    // Calculate stats
    const stats = useMemo(() => {
        const activeSuppliers = MOCK_SUPPLIERS.filter((s) => s.status === "Active").length;
        const totalSuppliers = MOCK_SUPPLIERS.length;
        const totalOutstanding = MOCK_SUPPLIERS.reduce((sum, s) => sum + s.currentBalance, 0);
        const totalPurchases = MOCK_SUPPLIERS.reduce((sum, s) => sum + s.totalPurchases, 0);

        return [
            {
                title: "Total Suppliers",
                value: totalSuppliers,
                subtext: `${activeSuppliers} active`,
                icon: Building2,
                trend: null,
            },
            {
                title: "Active Suppliers",
                value: activeSuppliers,
                subtext: `${totalSuppliers - activeSuppliers} inactive`,
                icon: CheckCircle,
                trend: { value: "12.5", isPositive: true },
            },
            {
                title: "Outstanding Balance",
                value: `PKR ${totalOutstanding.toLocaleString()}`,
                subtext: "Total payable",
                icon: DollarSign,
                trend: { value: "8.2", isPositive: false },
            },
            {
                title: "Total Purchases",
                value: `PKR ${(totalPurchases / 1000000).toFixed(1)}M`,
                subtext: "All time",
                icon: Package,
                trend: { value: "15.3", isPositive: true },
            },
        ];
    }, []);

    // Filter suppliers
    const filteredSuppliers = useMemo(() => {
        return MOCK_SUPPLIERS.filter((supplier) => {
            const matchesSearch =
                supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                supplier.phone.includes(searchQuery);

            const matchesStatus = statusFilter === "All" || supplier.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

    const handleLogout = () => navigate("/login/web");

    const handleAddSupplier = () => {
        setSelectedSupplier(null);
        setShowSupplierModal(true);
    };

    const handleEditSupplier = (supplier) => {
        setSelectedSupplier(supplier);
        setShowSupplierModal(true);
    };

    const handleDeleteSupplier = (supplier) => {
        if (window.confirm(`Are you sure you want to delete ${supplier.name}?`)) {
            alert("Supplier deleted successfully!");
        }
    };

    const handleCloseModal = () => {
        setShowSupplierModal(false);
        setSelectedSupplier(null);
    };

    const handleSaveSupplier = (supplierData) => {
        if (selectedSupplier) {
            alert(`Supplier "${supplierData.name}" updated successfully!`);
        } else {
            alert(`Supplier "${supplierData.name}" added successfully!`);
        }
        handleCloseModal();
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex min-h-screen">
                <Sidebar />

                <main className="flex-1">
                    {/* Header */}
                    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Suppliers</h1>
                                <p className="text-sm text-slate-500 mt-0.5">Manage supplier relationships and purchases</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Role Selector */}
                                <div className="relative">
                                    <select
                                        value={demoRole}
                                        onChange={(e) => setDemoRole(e.target.value)}
                                        className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer transition-colors"
                                    >
                                        <option>Admin</option>
                                        <option>Pharmacist</option>
                                        <option>Cashier</option>
                                    </select>
                                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>

                                {/* Role Badge */}
                                <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold border ${roleBadge.cls}`}>
                                    {roleBadge.label}
                                </span>

                                {/* User Info */}
                                <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-900">Demo User</p>
                                        <p className="text-xs text-slate-500">demo@eazyrx.local</p>
                                    </div>
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                                        DU
                                    </div>
                                </div>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div
                                                className={`h-12 w-12 rounded-xl flex items-center justify-center ${index === 0
                                                        ? "bg-blue-100"
                                                        : index === 1
                                                            ? "bg-emerald-100"
                                                            : index === 2
                                                                ? "bg-amber-100"
                                                                : "bg-purple-100"
                                                    }`}
                                            >
                                                <Icon
                                                    className={`h-6 w-6 ${index === 0
                                                            ? "text-blue-600"
                                                            : index === 1
                                                                ? "text-emerald-600"
                                                                : index === 2
                                                                    ? "text-amber-600"
                                                                    : "text-purple-600"
                                                        }`}
                                                />
                                            </div>
                                            {stat.trend && (
                                                <div
                                                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${stat.trend.isPositive
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {stat.trend.isPositive ? (
                                                        <TrendingUp className="h-3 w-3" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3" />
                                                    )}
                                                    {stat.trend.value}%
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
                                        <p className="text-xs text-slate-500 mt-1">{stat.subtext}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Filters & Actions */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 mb-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-end">
                                {/* Search */}
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Search Suppliers</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by name, contact, email, or phone..."
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Status Filter */}
                                <div className="w-full lg:w-48">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddSupplier}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Supplier
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Suppliers Table */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Supplier
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Payment Terms
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Balance
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredSuppliers.map((supplier) => (
                                            <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{supplier.name}</p>
                                                        <p className="text-xs text-slate-500">{supplier.contactPerson}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">
                                                            {supplier.productsSupplied} products
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                            <Mail className="h-3 w-3" />
                                                            {supplier.email}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                            <Phone className="h-3 w-3" />
                                                            {supplier.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-1.5">
                                                        <MapPin className="h-3 w-3 text-slate-400 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs text-slate-600">{supplier.city}</p>
                                                            <p className="text-xs text-slate-500">{supplier.country}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{supplier.paymentTerms}</p>
                                                        <p className="text-xs text-slate-500">
                                                            Limit: PKR {supplier.creditLimit.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p
                                                            className={`text-sm font-semibold ${supplier.currentBalance > 0 ? "text-amber-600" : "text-emerald-600"
                                                                }`}
                                                        >
                                                            PKR {supplier.currentBalance.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            Total: PKR {(supplier.totalPurchases / 1000).toFixed(0)}K
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${supplier.status === "Active"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-slate-100 text-slate-600"
                                                            }`}
                                                    >
                                                        {supplier.status === "Active" && (
                                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                        )}
                                                        {supplier.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditSupplier(supplier)}
                                                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                                            title="Edit Supplier"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSupplier(supplier)}
                                                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                                            title="Delete Supplier"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredSuppliers.length === 0 && (
                                <div className="text-center py-12">
                                    <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-slate-900">No suppliers found</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {searchQuery || statusFilter !== "All"
                                            ? "Try adjusting your filters"
                                            : "Add your first supplier to get started"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Supplier Modal */}
            {showSupplierModal && (
                <SupplierModal
                    supplier={selectedSupplier}
                    onClose={handleCloseModal}
                    onSave={handleSaveSupplier}
                />
            )}
        </div>
    );
}
