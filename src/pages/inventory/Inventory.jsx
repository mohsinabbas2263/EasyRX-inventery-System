import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    ChevronDown,
    Search,
    Filter,
    Download,
    Package,
    AlertTriangle,
    Calendar,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Plus,
    Minus,
    Clock,
    CheckCircle,
    XCircle,
    Archive,
} from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import { THEME } from "../../theme";
import StockAdjustmentModal from "./components/StockAdjustmentModal";

// Mock inventory data with batch tracking
const MOCK_INVENTORY = [
    {
        id: 1,
        productName: "Paracetamol 500mg",
        sku: "MED-001",
        batches: [
            { batchNo: "B2401", qty: 100, expiryDate: "2026-03-15", status: "good", location: "Shelf A1" },
            { batchNo: "B2415", qty: 50, expiryDate: "2026-08-20", status: "good", location: "Shelf A1" },
        ],
        totalStock: 150,
        minStock: 50,
        category: "Analgesics",
    },
    {
        id: 2,
        productName: "Omeprazole 20mg",
        sku: "MED-002",
        batches: [
            { batchNo: "B2398", qty: 45, expiryDate: "2026-02-20", status: "expiring_soon", location: "Shelf B2" },
        ],
        totalStock: 45,
        minStock: 30,
        category: "Gastrointestinal",
    },
    {
        id: 3,
        productName: "Cetirizine 10mg",
        sku: "MED-003",
        batches: [
            { batchNo: "B2405", qty: 120, expiryDate: "2026-04-10", status: "good", location: "Shelf C1" },
            { batchNo: "B2420", qty: 100, expiryDate: "2026-09-15", status: "good", location: "Shelf C1" },
        ],
        totalStock: 220,
        minStock: 40,
        category: "Antihistamines",
    },
    {
        id: 4,
        productName: "ORS Sachet",
        sku: "MED-006",
        batches: [
            { batchNo: "B2392", qty: 25, expiryDate: "2026-01-31", status: "expired", location: "Shelf D3" },
        ],
        totalStock: 25,
        minStock: 100,
        category: "Electrolytes",
    },
    {
        id: 5,
        productName: "Ibuprofen 400mg",
        sku: "MED-007",
        batches: [],
        totalStock: 0,
        minStock: 50,
        category: "Analgesics",
    },
    {
        id: 6,
        productName: "Amoxicillin 500mg",
        sku: "MED-004",
        batches: [
            { batchNo: "B2403", qty: 85, expiryDate: "2026-05-25", status: "good", location: "Shelf E1" },
        ],
        totalStock: 85,
        minStock: 60,
        category: "Antibiotics",
    },
    {
        id: 7,
        productName: "Metformin 500mg",
        sku: "MED-005",
        batches: [
            { batchNo: "B2407", qty: 180, expiryDate: "2026-06-30", status: "good", location: "Shelf F2" },
        ],
        totalStock: 180,
        minStock: 70,
        category: "Antidiabetic",
    },
    {
        id: 8,
        productName: "Vitamin D3 1000IU",
        sku: "MED-008",
        batches: [
            { batchNo: "B2410", qty: 95, expiryDate: "2027-01-20", status: "good", location: "Shelf G1" },
        ],
        totalStock: 95,
        minStock: 30,
        category: "Vitamins",
    },
];

export default function Inventory() {
    const navigate = useNavigate();
    const [demoRole, setDemoRole] = useState("Admin");
    const [inventory, setInventory] = useState(MOCK_INVENTORY);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);

    const roleBadge = useMemo(() => {
        if (demoRole === "Admin")
            return { label: "Admin • Full Access", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
        if (demoRole === "Pharmacist")
            return { label: "Pharmacist • Limited Access", cls: "bg-blue-50 text-blue-700 border-blue-200" };
        return { label: "Cashier • Limited Access", cls: "bg-amber-50 text-amber-700 border-amber-200" };
    }, [demoRole]);

    // Filter inventory
    const filteredInventory = useMemo(() => {
        return inventory.filter((item) => {
            const matchesSearch =
                item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesFilter = true;
            if (selectedFilter === "low_stock") {
                matchesFilter = item.totalStock <= item.minStock && item.totalStock > 0;
            } else if (selectedFilter === "out_of_stock") {
                matchesFilter = item.totalStock === 0;
            } else if (selectedFilter === "expiring_soon") {
                matchesFilter = item.batches.some((b) => b.status === "expiring_soon");
            } else if (selectedFilter === "expired") {
                matchesFilter = item.batches.some((b) => b.status === "expired");
            }

            return matchesSearch && matchesFilter;
        });
    }, [inventory, searchQuery, selectedFilter]);

    // Calculate stats
    const stats = useMemo(() => {
        const totalItems = inventory.length;
        const lowStock = inventory.filter((i) => i.totalStock <= i.minStock && i.totalStock > 0).length;
        const outOfStock = inventory.filter((i) => i.totalStock === 0).length;
        const expiringSoon = inventory.filter((i) => i.batches.some((b) => b.status === "expiring_soon")).length;
        const expired = inventory.filter((i) => i.batches.some((b) => b.status === "expired")).length;
        const totalBatches = inventory.reduce((sum, i) => sum + i.batches.length, 0);

        return { totalItems, lowStock, outOfStock, expiringSoon, expired, totalBatches };
    }, [inventory]);

    const handleLogout = () => navigate("/login/web");

    const toggleRowExpansion = (productId) => {
        setExpandedRows((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
    };

    const handleStockAdjustment = (product) => {
        setSelectedProduct(product);
        setIsAdjustmentModalOpen(true);
    };

    const handleSaveAdjustment = (adjustmentData) => {
        // Update inventory with new stock levels
        setInventory((prev) =>
            prev.map((item) =>
                item.id === selectedProduct.id
                    ? {
                        ...item,
                        batches: [...item.batches, adjustmentData.batch],
                        totalStock: item.totalStock + adjustmentData.quantity,
                    }
                    : item
            )
        );
        setIsAdjustmentModalOpen(false);
    };

    const getStockStatus = (item) => {
        if (item.totalStock === 0) {
            return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle };
        } else if (item.totalStock <= item.minStock) {
            return { label: "Low Stock", color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertTriangle };
        } else {
            return { label: "In Stock", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle };
        }
    };

    const getBatchStatus = (batch) => {
        if (batch.status === "expired") {
            return { label: "Expired", color: "bg-red-100 text-red-700 border-red-200" };
        } else if (batch.status === "expiring_soon") {
            return { label: "Expiring Soon", color: "bg-amber-100 text-amber-700 border-amber-200" };
        } else {
            return { label: "Good", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
        }
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
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory</h1>
                                <p className="text-sm text-slate-500 mt-0.5">Track stock levels and batch information</p>
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
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 mb-6">
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Items</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.totalItems}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <Package className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Batches</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.totalBatches}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                        <Archive className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.lowStock}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Out of Stock</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.outOfStock}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                                        <XCircle className="h-6 w-6 text-red-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiring Soon</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.expiringSoon}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expired</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.expired}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                                        <Calendar className="h-6 w-6 text-red-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm mb-6">
                            <div className="p-5">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search */}
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by product name or SKU..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Filter */}
                                    <select
                                        value={selectedFilter}
                                        onChange={(e) => setSelectedFilter(e.target.value)}
                                        className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                    >
                                        <option value="all">All Items</option>
                                        <option value="low_stock">Low Stock</option>
                                        <option value="out_of_stock">Out of Stock</option>
                                        <option value="expiring_soon">Expiring Soon</option>
                                        <option value="expired">Expired</option>
                                    </select>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                                            <Download className="h-4 w-4" />
                                            Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Table */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-8"></th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Total Stock
                                            </th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Min Stock
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Batches
                                            </th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredInventory.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="px-5 py-12 text-center">
                                                    <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                                    <p className="text-sm font-medium text-slate-500">No inventory items found</p>
                                                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredInventory.map((item) => {
                                                const stockStatus = getStockStatus(item);
                                                const StatusIcon = stockStatus.icon;
                                                const isExpanded = expandedRows.includes(item.id);

                                                return (
                                                    <React.Fragment key={item.id}>
                                                        <tr className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-5 py-4">
                                                                <button
                                                                    onClick={() => toggleRowExpansion(item.id)}
                                                                    className="p-1 rounded hover:bg-slate-200 transition-colors"
                                                                    disabled={item.batches.length === 0}
                                                                >
                                                                    <ChevronDown
                                                                        className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""
                                                                            } ${item.batches.length === 0 ? "opacity-30" : ""}`}
                                                                    />
                                                                </button>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                                                        <Package className="h-5 w-5 text-primary-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-semibold text-slate-900">{item.productName}</p>
                                                                        <p className="text-xs text-slate-500">{item.sku}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <span className="text-sm text-slate-600">{item.category}</span>
                                                            </td>
                                                            <td className="px-5 py-4 text-right">
                                                                <p className="text-sm font-semibold text-slate-900">{item.totalStock}</p>
                                                            </td>
                                                            <td className="px-5 py-4 text-right">
                                                                <p className="text-sm text-slate-600">{item.minStock}</p>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <span
                                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${stockStatus.color}`}
                                                                >
                                                                    <StatusIcon className="h-3 w-3" />
                                                                    {stockStatus.label}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4 text-center">
                                                                <span className="text-sm font-medium text-slate-900">{item.batches.length}</span>
                                                            </td>
                                                            <td className="px-5 py-4">
                                                                <div className="flex items-center justify-center">
                                                                    <button
                                                                        onClick={() => handleStockAdjustment(item)}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-semibold transition-colors"
                                                                    >
                                                                        <RefreshCw className="h-3.5 w-3.5" />
                                                                        Adjust
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        {/* Expanded Batch Details */}
                                                        {isExpanded && item.batches.length > 0 && (
                                                            <tr>
                                                                <td colSpan="8" className="bg-slate-50/50 px-5 py-4">
                                                                    <div className="ml-12">
                                                                        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                                                                            Batch Details
                                                                        </h4>
                                                                        <div className="space-y-2">
                                                                            {item.batches.map((batch, idx) => {
                                                                                const batchStatus = getBatchStatus(batch);
                                                                                return (
                                                                                    <div
                                                                                        key={idx}
                                                                                        className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200"
                                                                                    >
                                                                                        <div className="flex items-center gap-4">
                                                                                            <div className="text-sm">
                                                                                                <span className="font-semibold text-slate-900">Batch: </span>
                                                                                                <span className="text-slate-700">{batch.batchNo}</span>
                                                                                            </div>
                                                                                            <div className="text-sm">
                                                                                                <span className="font-semibold text-slate-900">Qty: </span>
                                                                                                <span className="text-slate-700">{batch.qty}</span>
                                                                                            </div>
                                                                                            <div className="text-sm flex items-center gap-1.5">
                                                                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                                                                <span className="text-slate-700">{batch.expiryDate}</span>
                                                                                            </div>
                                                                                            <div className="text-sm">
                                                                                                <span className="font-semibold text-slate-900">Location: </span>
                                                                                                <span className="text-slate-700">{batch.location}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <span
                                                                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${batchStatus.color}`}
                                                                                        >
                                                                                            {batchStatus.label}
                                                                                        </span>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Stock Adjustment Modal */}
            {isAdjustmentModalOpen && (
                <StockAdjustmentModal
                    product={selectedProduct}
                    onClose={() => setIsAdjustmentModalOpen(false)}
                    onSave={handleSaveAdjustment}
                />
            )}
        </div>
    );
}
