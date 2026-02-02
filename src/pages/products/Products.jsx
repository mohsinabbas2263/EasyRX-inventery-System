import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    ChevronDown,
    Search,
    Plus,
    Filter,
    Download,
    Upload,
    Package,
    AlertCircle,
    CheckCircle,
    Clock,
    Edit2,
    Trash2,
    Eye,
    MoreVertical,
    X,
    Tag,
    Calendar,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Minus,
} from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import { THEME } from "../../theme";
import ProductModal from "./components/ProductModal";

// Mock data for products
const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        genericName: "Acetaminophen",
        category: "Analgesics",
        manufacturer: "GSK",
        sku: "MED-001",
        barcode: "8901234567890",
        price: 5.0,
        costPrice: 3.5,
        stock: 150,
        minStock: 50,
        maxStock: 500,
        unit: "Tablets",
        status: "active",
        batch: "B2401",
        expiryDate: "2026-03-15",
        lastRestocked: "2026-01-15",
        supplier: "Pharma Distributors Ltd",
    },
    {
        id: 2,
        name: "Omeprazole 20mg",
        genericName: "Omeprazole",
        category: "Gastrointestinal",
        manufacturer: "AstraZeneca",
        sku: "MED-002",
        barcode: "8901234567891",
        price: 12.5,
        costPrice: 8.0,
        stock: 45,
        minStock: 30,
        maxStock: 300,
        unit: "Capsules",
        status: "active",
        batch: "B2398",
        expiryDate: "2026-02-20",
        lastRestocked: "2026-01-10",
        supplier: "MedSupply Co",
    },
    {
        id: 3,
        name: "Cetirizine 10mg",
        genericName: "Cetirizine HCl",
        category: "Antihistamines",
        manufacturer: "Abbott",
        sku: "MED-003",
        barcode: "8901234567892",
        price: 8.0,
        costPrice: 5.5,
        stock: 220,
        minStock: 40,
        maxStock: 400,
        unit: "Tablets",
        status: "active",
        batch: "B2405",
        expiryDate: "2026-04-10",
        lastRestocked: "2026-01-20",
        supplier: "Pharma Distributors Ltd",
    },
    {
        id: 4,
        name: "Amoxicillin 500mg",
        genericName: "Amoxicillin",
        category: "Antibiotics",
        manufacturer: "Pfizer",
        sku: "MED-004",
        barcode: "8901234567893",
        price: 15.0,
        costPrice: 10.0,
        stock: 85,
        minStock: 60,
        maxStock: 350,
        unit: "Capsules",
        status: "active",
        batch: "B2403",
        expiryDate: "2026-05-25",
        lastRestocked: "2026-01-18",
        supplier: "Global Pharma",
    },
    {
        id: 5,
        name: "Metformin 500mg",
        genericName: "Metformin HCl",
        category: "Antidiabetic",
        manufacturer: "Merck",
        sku: "MED-005",
        barcode: "8901234567894",
        price: 6.5,
        costPrice: 4.0,
        stock: 180,
        minStock: 70,
        maxStock: 450,
        unit: "Tablets",
        status: "active",
        batch: "B2407",
        expiryDate: "2026-06-30",
        lastRestocked: "2026-01-22",
        supplier: "MedSupply Co",
    },
    {
        id: 6,
        name: "ORS Sachet",
        genericName: "Oral Rehydration Salts",
        category: "Electrolytes",
        manufacturer: "Local Pharma",
        sku: "MED-006",
        barcode: "8901234567895",
        price: 2.5,
        costPrice: 1.5,
        stock: 25,
        minStock: 100,
        maxStock: 600,
        unit: "Sachets",
        status: "active",
        batch: "B2392",
        expiryDate: "2026-01-31",
        lastRestocked: "2025-12-15",
        supplier: "Pharma Distributors Ltd",
    },
    {
        id: 7,
        name: "Ibuprofen 400mg",
        genericName: "Ibuprofen",
        category: "Analgesics",
        manufacturer: "GSK",
        sku: "MED-007",
        barcode: "8901234567896",
        price: 7.5,
        costPrice: 5.0,
        stock: 0,
        minStock: 50,
        maxStock: 400,
        unit: "Tablets",
        status: "out_of_stock",
        batch: "B2400",
        expiryDate: "2026-07-15",
        lastRestocked: "2025-12-20",
        supplier: "Global Pharma",
    },
    {
        id: 8,
        name: "Vitamin D3 1000IU",
        genericName: "Cholecalciferol",
        category: "Vitamins",
        manufacturer: "Nature's Bounty",
        sku: "MED-008",
        barcode: "8901234567897",
        price: 18.0,
        costPrice: 12.0,
        stock: 95,
        minStock: 30,
        maxStock: 250,
        unit: "Capsules",
        status: "active",
        batch: "B2410",
        expiryDate: "2027-01-20",
        lastRestocked: "2026-01-25",
        supplier: "Wellness Imports",
    },
];

const CATEGORIES = ["All", "Analgesics", "Gastrointestinal", "Antihistamines", "Antibiotics", "Antidiabetic", "Electrolytes", "Vitamins"];

export default function Products() {
    const navigate = useNavigate();
    const [demoRole, setDemoRole] = useState("Admin");
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const roleBadge = useMemo(() => {
        if (demoRole === "Admin")
            return { label: "Admin • Full Access", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
        if (demoRole === "Pharmacist")
            return { label: "Pharmacist • Limited Access", cls: "bg-blue-50 text-blue-700 border-blue-200" };
        return { label: "Cashier • Limited Access", cls: "bg-amber-50 text-amber-700 border-amber-200" };
    }, [demoRole]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.barcode.includes(searchQuery);

            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

            const matchesStatus =
                selectedStatus === "all" ||
                (selectedStatus === "active" && product.status === "active") ||
                (selectedStatus === "low_stock" && product.stock <= product.minStock && product.stock > 0) ||
                (selectedStatus === "out_of_stock" && product.stock === 0);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products, searchQuery, selectedCategory, selectedStatus]);

    // Calculate stats
    const stats = useMemo(() => {
        const total = products.length;
        const active = products.filter((p) => p.status === "active").length;
        const lowStock = products.filter((p) => p.stock <= p.minStock && p.stock > 0).length;
        const outOfStock = products.filter((p) => p.stock === 0).length;
        const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);

        return { total, active, lowStock, outOfStock, totalValue };
    }, [products]);

    const handleLogout = () => navigate("/login/web");

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = (productId) => {
        if (confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter((p) => p.id !== productId));
        }
    };

    const handleSaveProduct = (productData) => {
        if (editingProduct) {
            // Update existing product
            setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p)));
        } else {
            // Add new product
            const newProduct = {
                ...productData,
                id: Math.max(...products.map((p) => p.id)) + 1,
            };
            setProducts([...products, newProduct]);
        }
        setIsModalOpen(false);
    };

    const getStockStatus = (product) => {
        if (product.stock === 0) {
            return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200" };
        } else if (product.stock <= product.minStock) {
            return { label: "Low Stock", color: "bg-amber-100 text-amber-700 border-amber-200" };
        } else if (product.stock >= product.maxStock * 0.8) {
            return { label: "Overstocked", color: "bg-purple-100 text-purple-700 border-purple-200" };
        } else {
            return { label: "In Stock", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
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
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products</h1>
                                <p className="text-sm text-slate-500 mt-0.5">Manage your product catalog</p>
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
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-6">
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Products</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <Package className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats.active}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle className="h-6 w-6 text-emerald-600" />
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
                                        <AlertCircle className="h-6 w-6 text-amber-600" />
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
                                        <X className="h-6 w-6 text-red-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Value</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">PKR {stats.totalValue.toLocaleString()}</p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                        <DollarSign className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters & Actions */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm mb-6">
                            <div className="p-5">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search */}
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by name, generic name, SKU, or barcode..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Category Filter */}
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Status Filter */}
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="low_stock">Low Stock</option>
                                        <option value="out_of_stock">Out of Stock</option>
                                    </select>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                                            <Download className="h-4 w-4" />
                                            Export
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                                            <Upload className="h-4 w-4" />
                                            Import
                                        </button>
                                        <button
                                            onClick={handleAddProduct}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Product
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                SKU / Barcode
                                            </th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Expiry
                                            </th>
                                            <th className="px-5 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="px-5 py-12 text-center">
                                                    <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                                    <p className="text-sm font-medium text-slate-500">No products found</p>
                                                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProducts.map((product) => {
                                                const stockStatus = getStockStatus(product);
                                                return (
                                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                                                    <Package className="h-5 w-5 text-primary-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                                                                    <p className="text-xs text-slate-500">{product.genericName}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                                                <Tag className="h-3 w-3" />
                                                                {product.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <p className="text-sm font-medium text-slate-900">{product.sku}</p>
                                                            <p className="text-xs text-slate-500">{product.barcode}</p>
                                                        </td>
                                                        <td className="px-5 py-4 text-right">
                                                            <p className="text-sm font-semibold text-slate-900">PKR {product.price.toFixed(2)}</p>
                                                            <p className="text-xs text-slate-500">Cost: PKR {product.costPrice.toFixed(2)}</p>
                                                        </td>
                                                        <td className="px-5 py-4 text-right">
                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {product.stock} {product.unit}
                                                            </p>
                                                            <p className="text-xs text-slate-500">Min: {product.minStock}</p>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${stockStatus.color}`}>
                                                                {stockStatus.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                                <span className="text-sm text-slate-600">{product.expiryDate}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 mt-0.5">Batch: {product.batch}</p>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleEditProduct(product)}
                                                                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteProduct(product.id)}
                                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredProducts.length > 0 && (
                                <div className="border-t border-slate-200 px-5 py-4 flex items-center justify-between">
                                    <p className="text-sm text-slate-600">
                                        Showing <span className="font-semibold">{filteredProducts.length}</span> of{" "}
                                        <span className="font-semibold">{products.length}</span> products
                                    </p>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            Previous
                                        </button>
                                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Product Modal */}
            {isModalOpen && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveProduct}
                />
            )}
        </div>
    );
}
