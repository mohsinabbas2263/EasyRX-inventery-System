import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    ChevronDown,
    Plus,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    Clock,
    XCircle,
    Package,
    FileText,
    Calendar,
    DollarSign,
    TrendingUp,
    AlertCircle,
} from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import GRNModal from "./components/GRNModal";
import { THEME } from "../../theme";

// Mock GRN Data
const MOCK_GRNS = [
    {
        id: 1,
        grnNumber: "GRN-2026-001",
        poNumber: "PO-2026-045",
        supplier: "MediPharma Suppliers",
        date: "2026-01-27",
        receivedBy: "Ahmed Khan",
        totalItems: 5,
        totalQuantity: 250,
        totalAmount: 125000,
        status: "Completed",
        items: [
            { product: "Paracetamol 500mg", quantity: 100, rate: 5, amount: 500, batch: "B2401", expiry: "2027-01-15" },
            { product: "Omeprazole 20mg", quantity: 50, rate: 12.5, amount: 625, batch: "B2402", expiry: "2026-12-20" },
        ],
    },
    {
        id: 2,
        grnNumber: "GRN-2026-002",
        poNumber: "PO-2026-046",
        supplier: "HealthCare Distributors",
        date: "2026-01-26",
        receivedBy: "Fatima Ali",
        totalItems: 3,
        totalQuantity: 150,
        totalAmount: 85000,
        status: "Pending",
        items: [],
    },
    {
        id: 3,
        grnNumber: "GRN-2026-003",
        poNumber: "PO-2026-047",
        supplier: "Global Pharma Solutions",
        date: "2026-01-25",
        receivedBy: "Hassan Raza",
        totalItems: 8,
        totalQuantity: 400,
        totalAmount: 215000,
        status: "Completed",
        items: [],
    },
    {
        id: 4,
        grnNumber: "GRN-2026-004",
        poNumber: "PO-2026-048",
        supplier: "MediPharma Suppliers",
        date: "2026-01-24",
        receivedBy: "Ahmed Khan",
        totalItems: 4,
        totalQuantity: 180,
        totalAmount: 95000,
        status: "Rejected",
        items: [],
    },
];

export default function GRN() {
    const navigate = useNavigate();
    const [demoRole, setDemoRole] = useState("Admin");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showGRNModal, setShowGRNModal] = useState(false);
    const [selectedGRN, setSelectedGRN] = useState(null);

    const roleBadge = useMemo(() => {
        if (demoRole === "Admin")
            return { label: "Admin • Full Access", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
        if (demoRole === "Pharmacist")
            return { label: "Pharmacist • Limited Access", cls: "bg-blue-50 text-blue-700 border-blue-200" };
        return { label: "Cashier • Limited Access", cls: "bg-amber-50 text-amber-700 border-amber-200" };
    }, [demoRole]);

    // Calculate stats
    const stats = useMemo(() => {
        const completed = MOCK_GRNS.filter((g) => g.status === "Completed").length;
        const pending = MOCK_GRNS.filter((g) => g.status === "Pending").length;
        const rejected = MOCK_GRNS.filter((g) => g.status === "Rejected").length;
        const totalValue = MOCK_GRNS.filter((g) => g.status === "Completed").reduce(
            (sum, g) => sum + g.totalAmount,
            0
        );

        return [
            {
                title: "Total GRNs",
                value: MOCK_GRNS.length,
                subtext: "All time",
                icon: FileText,
                trend: null,
            },
            {
                title: "Completed",
                value: completed,
                subtext: `${pending} pending`,
                icon: CheckCircle,
                trend: { value: "18.2", isPositive: true },
            },
            {
                title: "Pending Review",
                value: pending,
                subtext: `${rejected} rejected`,
                icon: Clock,
                trend: null,
            },
            {
                title: "Total Value",
                value: `PKR ${(totalValue / 1000).toFixed(0)}K`,
                subtext: "Completed GRNs",
                icon: DollarSign,
                trend: { value: "12.5", isPositive: true },
            },
        ];
    }, []);

    // Filter GRNs
    const filteredGRNs = useMemo(() => {
        return MOCK_GRNS.filter((grn) => {
            const matchesSearch =
                grn.grnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                grn.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                grn.supplier.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === "All" || grn.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

    const handleLogout = () => navigate("/login/web");

    const handleCreateGRN = () => {
        setSelectedGRN(null);
        setShowGRNModal(true);
    };

    const handleViewGRN = (grn) => {
        setSelectedGRN(grn);
        setShowGRNModal(true);
    };

    const handleCloseModal = () => {
        setShowGRNModal(false);
        setSelectedGRN(null);
    };

    const handleSaveGRN = (grnData) => {
        alert(`GRN "${grnData.grnNumber}" saved successfully!`);
        handleCloseModal();
    };

    const getStatusBadge = (status) => {
        const badges = {
            Completed: {
                bg: "bg-emerald-100",
                text: "text-emerald-700",
                icon: CheckCircle,
                dot: "bg-emerald-500",
            },
            Pending: {
                bg: "bg-amber-100",
                text: "text-amber-700",
                icon: Clock,
                dot: "bg-amber-500",
            },
            Rejected: {
                bg: "bg-red-100",
                text: "text-red-700",
                icon: XCircle,
                dot: "bg-red-500",
            },
        };
        return badges[status] || badges.Pending;
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
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    Goods Receipt Note (GRN)
                                </h1>
                                <p className="text-sm text-slate-500 mt-0.5">Receive and verify purchase orders</p>
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
                                                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                    <TrendingUp className="h-3 w-3" />
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
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Search GRNs</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by GRN number, PO number, or supplier..."
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
                                        <option value="Completed">Completed</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCreateGRN}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Create GRN
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* GRN Table */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                GRN Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Supplier
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Items
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Amount
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
                                        {filteredGRNs.map((grn) => {
                                            const statusBadge = getStatusBadge(grn.status);
                                            const StatusIcon = statusBadge.icon;

                                            return (
                                                <tr key={grn.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900">{grn.grnNumber}</p>
                                                            <p className="text-xs text-slate-500">PO: {grn.poNumber}</p>
                                                            <p className="text-xs text-slate-400 mt-0.5">By: {grn.receivedBy}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-medium text-slate-900">{grn.supplier}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                            {grn.date}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">
                                                                {grn.totalItems} items
                                                            </p>
                                                            <p className="text-xs text-slate-500">{grn.totalQuantity} units</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-semibold text-primary-600">
                                                            PKR {grn.totalAmount.toLocaleString()}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}
                                                        >
                                                            <div className={`h-1.5 w-1.5 rounded-full ${statusBadge.dot}`}></div>
                                                            {grn.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleViewGRN(grn)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-colors"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {filteredGRNs.length === 0 && (
                                <div className="text-center py-12">
                                    <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-slate-900">No GRNs found</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {searchQuery || statusFilter !== "All"
                                            ? "Try adjusting your filters"
                                            : "Create your first GRN to get started"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* GRN Modal */}
            {showGRNModal && (
                <GRNModal grn={selectedGRN} onClose={handleCloseModal} onSave={handleSaveGRN} />
            )}
        </div>
    );
}
