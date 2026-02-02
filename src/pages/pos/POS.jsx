import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    ChevronDown,
    Search,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    User,
    CreditCard,
    Banknote,
    Smartphone,
    Receipt,
    X,
    Check,
    Barcode,
    Package,
    Clock,
    DollarSign,
    Percent,
    AlertCircle,
} from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import { THEME } from "../../theme";
import PaymentModal from "./components/PaymentModal";
import ReceiptModal from "./components/ReceiptModal";
import { canApplyDiscount } from "../../utils/permissions";
import { allocateStockFEFO, formatExpiryDate, getBatchStatusBadge } from "../../utils/batchManagement";
import { auditLogger, AUDIT_ACTIONS, logDiscountApply } from "../../utils/auditLogger";

// Mock products data with batch information
const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        genericName: "Acetaminophen",
        category: "Analgesics",
        sku: "MED-001",
        barcode: "8901234567890",
        price: 5.0,
        stock: 150,
        unit: "Tablets",
        isMedicine: true,
        batches: [
            { batchNo: "PAR-2024-01", expiryDate: "2026-12-31", quantity: 50, location: "A1" },
            { batchNo: "PAR-2024-02", expiryDate: "2026-06-30", quantity: 100, location: "A2" },
        ],
    },
    {
        id: 2,
        name: "Omeprazole 20mg",
        genericName: "Omeprazole",
        category: "Gastrointestinal",
        sku: "MED-002",
        barcode: "8901234567891",
        price: 12.5,
        stock: 45,
        unit: "Capsules",
        isMedicine: true,
        batches: [
            { batchNo: "OME-2024-01", expiryDate: "2026-03-31", quantity: 45, location: "B1" },
        ],
    },
    {
        id: 3,
        name: "Cetirizine 10mg",
        genericName: "Cetirizine HCl",
        category: "Antihistamines",
        sku: "MED-003",
        barcode: "8901234567892",
        price: 8.0,
        stock: 220,
        unit: "Tablets",
        isMedicine: true,
        batches: [
            { batchNo: "CET-2024-01", expiryDate: "2027-01-15", quantity: 120, location: "C1" },
            { batchNo: "CET-2024-02", expiryDate: "2026-09-30", quantity: 100, location: "C2" },
        ],
    },
    {
        id: 4,
        name: "Amoxicillin 500mg",
        genericName: "Amoxicillin",
        category: "Antibiotics",
        sku: "MED-004",
        barcode: "8901234567893",
        price: 15.0,
        stock: 85,
        unit: "Capsules",
        isMedicine: true,
        batches: [
            { batchNo: "AMX-2024-01", expiryDate: "2026-08-31", quantity: 85, location: "D1" },
        ],
    },
    {
        id: 5,
        name: "Metformin 500mg",
        genericName: "Metformin HCl",
        category: "Antidiabetic",
        sku: "MED-005",
        barcode: "8901234567894",
        price: 6.5,
        stock: 180,
        unit: "Tablets",
        isMedicine: true,
        batches: [
            { batchNo: "MET-2024-01", expiryDate: "2027-02-28", quantity: 180, location: "E1" },
        ],
    },
    {
        id: 6,
        name: "ORS Sachet",
        genericName: "Oral Rehydration Salts",
        category: "Electrolytes",
        sku: "MED-006",
        barcode: "8901234567895",
        price: 2.5,
        stock: 25,
        unit: "Sachets",
        isMedicine: false,
        batches: [
            { batchNo: "ORS-2024-01", expiryDate: "2026-05-31", quantity: 25, location: "F1" },
        ],
    },
    {
        id: 7,
        name: "Vitamin D3 1000IU",
        genericName: "Cholecalciferol",
        category: "Vitamins",
        sku: "MED-008",
        barcode: "8901234567897",
        price: 18.0,
        stock: 95,
        unit: "Capsules",
        isMedicine: false,
        batches: [
            { batchNo: "VIT-2024-01", expiryDate: "2027-03-31", quantity: 95, location: "G1" },
        ],
    },
    {
        id: 8,
        name: "Ibuprofen 400mg",
        genericName: "Ibuprofen",
        category: "Analgesics",
        sku: "MED-007",
        barcode: "8901234567896",
        price: 7.5,
        stock: 120,
        unit: "Tablets",
        isMedicine: true,
        batches: [
            { batchNo: "IBU-2024-01", expiryDate: "2026-10-31", quantity: 70, location: "H1" },
            { batchNo: "IBU-2024-02", expiryDate: "2026-07-15", quantity: 50, location: "H2" },
        ],
    },
];

// Mock recent transactions
const MOCK_TRANSACTIONS = [
    {
        id: "INV-10231",
        date: "2026-01-27 18:30",
        items: 3,
        total: 45.5,
        paymentMethod: "Cash",
        customer: "Walk-in",
    },
    {
        id: "INV-10230",
        date: "2026-01-27 18:15",
        items: 2,
        total: 23.0,
        paymentMethod: "Card",
        customer: "Ahmed Khan",
    },
    {
        id: "INV-10229",
        date: "2026-01-27 17:55",
        items: 5,
        total: 67.5,
        paymentMethod: "Digital",
        customer: "Walk-in",
    },
];

export default function POS() {
    const navigate = useNavigate();
    const [demoRole, setDemoRole] = useState("Admin");
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState("percentage"); // percentage or fixed
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [lastTransaction, setLastTransaction] = useState(null);
    const searchInputRef = useRef(null);

    const roleBadge = useMemo(() => {
        if (demoRole === "Admin")
            return { label: "Admin • Full Access", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
        if (demoRole === "Pharmacist")
            return { label: "Pharmacist • Limited Access", cls: "bg-blue-50 text-blue-700 border-blue-200" };
        return { label: "Cashier • Limited Access", cls: "bg-amber-50 text-amber-700 border-amber-200" };
    }, [demoRole]);

    // Filter products based on search
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return [];

        return MOCK_PRODUCTS.filter((product) => {
            const query = searchQuery.toLowerCase();
            return (
                product.name.toLowerCase().includes(query) ||
                product.genericName.toLowerCase().includes(query) ||
                product.sku.toLowerCase().includes(query) ||
                product.barcode.includes(query)
            );
        }).slice(0, 5); // Show max 5 results
    }, [searchQuery]);

    // Calculate cart totals
    const cartSummary = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let discountAmount = 0;

        if (discountType === "percentage") {
            discountAmount = (subtotal * discount) / 100;
        } else {
            discountAmount = discount;
        }

        const total = Math.max(0, subtotal - discountAmount);
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        return { subtotal, discountAmount, total, itemCount };
    }, [cart, discount, discountType]);

    const handleLogout = () => navigate("/login/web");

    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id);

        // Allocate stock using FEFO
        const currentQty = existingItem ? existingItem.quantity : 0;
        const requestedQty = currentQty + 1;
        const allocation = allocateStockFEFO(product.batches || [], requestedQty);

        if (!allocation.fullyAllocated) {
            alert(`Cannot add more. Only ${product.stock} in stock.`);
            return;
        }

        if (existingItem) {
            // Check stock
            if (existingItem.quantity >= product.stock) {
                alert(`Cannot add more. Only ${product.stock} in stock.`);
                return;
            }

            setCart(
                cart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1, batchAllocations: allocation.allocations }
                        : item
                )
            );
        } else {
            if (product.stock === 0) {
                alert("Product out of stock!");
                return;
            }

            setCart([...cart, {
                ...product,
                quantity: 1,
                batchAllocations: allocation.allocations
            }]);
        }

        // Clear search
        setSearchQuery("");
        searchInputRef.current?.focus();
    };

    const updateQuantity = (productId, newQuantity) => {
        const product = MOCK_PRODUCTS.find((p) => p.id === productId);

        if (newQuantity > product.stock) {
            alert(`Cannot add more. Only ${product.stock} in stock.`);
            return;
        }

        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        // Recalculate FEFO allocation for new quantity
        const allocation = allocateStockFEFO(product.batches || [], newQuantity);

        if (!allocation.fullyAllocated) {
            alert(`Cannot allocate ${newQuantity} units. Only ${product.stock} available.`);
            return;
        }

        setCart(cart.map((item) => (
            item.id === productId
                ? { ...item, quantity: newQuantity, batchAllocations: allocation.allocations }
                : item
        )));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.id !== productId));
    };

    const clearCart = () => {
        if (cart.length === 0) return;
        if (confirm("Are you sure you want to clear the cart?")) {
            setCart([]);
            setDiscount(0);
            setSelectedCustomer(null);
        }
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }
        setIsPaymentModalOpen(true);
    };

    const handlePaymentComplete = async (paymentData) => {
        // Create transaction
        const transaction = {
            id: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
            date: new Date().toLocaleString("en-PK", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
            items: cart,
            subtotal: cartSummary.subtotal,
            discount: cartSummary.discountAmount,
            total: cartSummary.total,
            paymentMethod: paymentData.method,
            amountPaid: paymentData.amountPaid,
            change: paymentData.change,
            customer: selectedCustomer || "Walk-in",
        };

        // Audit logging
        try {
            // Log sale completion
            await auditLogger.log(AUDIT_ACTIONS.SALE_COMPLETE, {
                userId: 'demo-user',
                userName: 'Demo User',
                userRole: demoRole,
                documentId: transaction.id,
                documentType: 'sale',
                metadata: {
                    items: cart.length,
                    subtotal: cartSummary.subtotal,
                    total: cartSummary.total,
                    paymentMethod: paymentData.method,
                    customer: selectedCustomer || "Walk-in",
                },
            });

            // Log discount if applied
            if (cartSummary.discountAmount > 0) {
                await logDiscountApply(
                    transaction.id,
                    cartSummary.discountAmount,
                    discountType === 'percentage' ? discount : null,
                    {
                        id: 'demo-user',
                        name: 'Demo User',
                        role: demoRole,
                    },
                    `${discountType === 'percentage' ? discount + '%' : 'PKR ' + discount} discount applied`
                );
            }
        } catch (error) {
            console.error('Audit logging failed:', error);
            // Continue with transaction even if audit logging fails
        }

        setLastTransaction(transaction);
        setIsPaymentModalOpen(false);
        setIsReceiptModalOpen(true);

        // Clear cart
        setCart([]);
        setDiscount(0);
        setSelectedCustomer(null);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            // F2 - Focus search
            if (e.key === "F2") {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            // F9 - Checkout
            if (e.key === "F9" && cart.length > 0) {
                e.preventDefault();
                handleCheckout();
            }
            // Escape - Clear search
            if (e.key === "Escape" && searchQuery) {
                setSearchQuery("");
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [cart, searchQuery]);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex min-h-screen">
                <Sidebar />

                <main className="flex-1">
                    {/* Header */}
                    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Point of Sale</h1>
                                <p className="text-sm text-slate-500 mt-0.5">Process sales and manage transactions</p>
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
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Side - Product Search & Cart */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Search Bar */}
                                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Barcode className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search products by name, SKU, or scan barcode... (F2)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors text-lg"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Search Results */}
                                    {filteredProducts.length > 0 && (
                                        <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                                            {filteredProducts.map((product) => (
                                                <button
                                                    key={product.id}
                                                    onClick={() => addToCart(product)}
                                                    className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-all group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                                            <Package className="h-5 w-5 text-primary-600" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                                                            <p className="text-xs text-slate-500">
                                                                {product.sku} • Stock: {product.stock}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-primary-600">PKR {product.price.toFixed(2)}</p>
                                                        <p className="text-xs text-slate-500 group-hover:text-primary-600">Click to add</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Cart */}
                                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                                    <div className="flex items-center justify-between p-5 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                                                <ShoppingCart className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-semibold text-slate-900">Shopping Cart</h2>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {cartSummary.itemCount} {cartSummary.itemCount === 1 ? "item" : "items"}
                                                </p>
                                            </div>
                                        </div>
                                        {cart.length > 0 && (
                                            <button
                                                onClick={clearCart}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Clear
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        {cart.length === 0 ? (
                                            <div className="text-center py-12">
                                                <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-3" />
                                                <p className="text-sm font-medium text-slate-500">Cart is empty</p>
                                                <p className="text-xs text-slate-400 mt-1">Search and add products to get started</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {cart.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                                                    >
                                                        <div className="flex-1">
                                                            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                PKR {item.price.toFixed(2)} × {item.quantity} = PKR{" "}
                                                                {(item.price * item.quantity).toFixed(2)}
                                                            </p>
                                                            {item.batchAllocations && item.batchAllocations.length > 0 && (
                                                                <div className="mt-1.5 flex flex-wrap gap-1">
                                                                    {item.batchAllocations.map((batch, idx) => {
                                                                        const statusBadge = getBatchStatusBadge(batch.expiryDate);
                                                                        return (
                                                                            <span
                                                                                key={idx}
                                                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${statusBadge.color}`}
                                                                                title={`Expiry: ${formatExpiryDate(batch.expiryDate)}`}
                                                                            >
                                                                                <Package className="h-3 w-3" />
                                                                                {batch.batchNo} ({batch.quantity})
                                                                            </span>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </button>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                                                className="w-16 text-center px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-semibold"
                                                            />
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors ml-2"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Summary & Actions */}
                            <div className="space-y-6">
                                {/* Customer Selection */}
                                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <User className="h-4 w-4 text-slate-600" />
                                        <h3 className="text-sm font-semibold text-slate-900">Customer</h3>
                                    </div>
                                    <select
                                        value={selectedCustomer || ""}
                                        onChange={(e) => setSelectedCustomer(e.target.value || null)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                                    >
                                        <option value="">Walk-in Customer</option>
                                        <option value="Ahmed Khan">Ahmed Khan</option>
                                        <option value="Fatima Ali">Fatima Ali</option>
                                        <option value="Hassan Raza">Hassan Raza</option>
                                    </select>
                                </div>

                                {/* Discount */}
                                {canApplyDiscount(demoRole) ? (
                                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Percent className="h-4 w-4 text-slate-600" />
                                            <h3 className="text-sm font-semibold text-slate-900">Discount</h3>
                                        </div>
                                        <div className="flex gap-2 mb-2">
                                            <button
                                                onClick={() => setDiscountType("percentage")}
                                                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${discountType === "percentage"
                                                    ? "bg-primary-100 text-primary-700 border-2 border-primary-500"
                                                    : "bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200"
                                                    }`}
                                            >
                                                Percentage
                                            </button>
                                            <button
                                                onClick={() => setDiscountType("fixed")}
                                                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${discountType === "fixed"
                                                    ? "bg-primary-100 text-primary-700 border-2 border-primary-500"
                                                    : "bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200"
                                                    }`}
                                            >
                                                Fixed
                                            </button>
                                        </div>
                                        <input
                                            type="number"
                                            value={discount}
                                            onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                                            placeholder={discountType === "percentage" ? "0%" : "PKR 0"}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 shadow-sm p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="h-4 w-4 text-amber-600" />
                                            <h3 className="text-sm font-semibold text-amber-900">Discount Restricted</h3>
                                        </div>
                                        <p className="text-xs text-amber-700">
                                            Your role does not have permission to apply discounts. Contact a manager for assistance.
                                        </p>
                                    </div>
                                )}

                                {/* Summary */}
                                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Order Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">Subtotal</span>
                                            <span className="font-semibold text-slate-900">PKR {cartSummary.subtotal.toFixed(2)}</span>
                                        </div>
                                        {cartSummary.discountAmount > 0 && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">
                                                    Discount {discountType === "percentage" && `(${discount}%)`}
                                                </span>
                                                <span className="font-semibold text-red-600">
                                                    - PKR {cartSummary.discountAmount.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="border-t border-slate-200 pt-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-bold text-slate-900">Total</span>
                                                <span className="text-2xl font-bold text-primary-600">
                                                    PKR {cartSummary.total.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={cart.length === 0}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-lg font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                                >
                                    <CreditCard className="h-5 w-5" />
                                    Checkout (F9)
                                </button>

                                {/* Recent Transactions */}
                                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Clock className="h-4 w-4 text-slate-600" />
                                        <h3 className="text-sm font-semibold text-slate-900">Recent Transactions</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {MOCK_TRANSACTIONS.map((transaction) => (
                                            <div
                                                key={transaction.id}
                                                className="p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-semibold text-slate-900">{transaction.id}</span>
                                                    <span className="text-xs font-bold text-primary-600">
                                                        PKR {transaction.total.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                    <span>{transaction.items} items</span>
                                                    <span>{transaction.paymentMethod}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <PaymentModal
                    total={cartSummary.total}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onComplete={handlePaymentComplete}
                />
            )}

            {/* Receipt Modal */}
            {isReceiptModalOpen && lastTransaction && (
                <ReceiptModal
                    transaction={lastTransaction}
                    onClose={() => setIsReceiptModalOpen(false)}
                />
            )}
        </div>
    );
}
