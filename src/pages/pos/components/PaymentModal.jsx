import React, { useState, useEffect, useRef, useMemo } from "react";
import { X, CreditCard, Banknote, Smartphone, Check, AlertCircle } from "lucide-react";

const PAYMENT_METHODS = [
    { id: "cash", label: "Cash", icon: Banknote, color: "emerald" },
    { id: "card", label: "Card", icon: CreditCard, color: "blue" },
    { id: "digital", label: "Digital Wallet", icon: Smartphone, color: "purple" },
];

export default function PaymentModal({ total, onClose, onComplete }) {
    const [selectedMethod, setSelectedMethod] = useState("cash");
    const [amountPaid, setAmountPaid] = useState("");
    const [error, setError] = useState("");
    const amountInputRef = useRef(null);

    const change = useMemo(() => {
        const paid = parseFloat(amountPaid) || 0;
        return Math.max(0, paid - total);
    }, [amountPaid, total]);

    const isValidPayment = useMemo(() => {
        const paid = parseFloat(amountPaid) || 0;
        return paid >= total;
    }, [amountPaid, total]);

    useEffect(() => {
        // Auto-focus amount input
        setTimeout(() => amountInputRef.current?.focus(), 100);
    }, []);

    // Quick amount buttons for cash
    const quickAmounts = [
        Math.ceil(total / 100) * 100, // Round up to nearest 100
        Math.ceil(total / 500) * 500, // Round up to nearest 500
        Math.ceil(total / 1000) * 1000, // Round up to nearest 1000
    ].filter((amount, index, arr) => arr.indexOf(amount) === index); // Remove duplicates

    const handleComplete = () => {
        if (!isValidPayment) {
            setError("Amount paid must be greater than or equal to total");
            return;
        }

        onComplete({
            method: PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label || "Cash",
            amountPaid: parseFloat(amountPaid),
            change: change,
        });
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Enter to complete
            if (e.key === "Enter" && isValidPayment) {
                e.preventDefault();
                handleComplete();
            }
            // Escape to close
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
            // Number keys 1-3 for payment methods
            if (["1", "2", "3"].includes(e.key)) {
                const methods = ["cash", "card", "digital"];
                setSelectedMethod(methods[parseInt(e.key) - 1]);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isValidPayment]);

    const getMethodColor = (methodId) => {
        const method = PAYMENT_METHODS.find((m) => m.id === methodId);
        return method?.color || "emerald";
    };

    // Static class map for Tailwind JIT compatibility
    const colorClasses = {
        emerald: {
            border: 'border-emerald-500',
            bg: 'bg-emerald-50',
            bgDark: 'bg-emerald-500',
            bgIcon: 'bg-emerald-100',
            text: 'text-emerald-600',
            textDark: 'text-emerald-700'
        },
        blue: {
            border: 'border-blue-500',
            bg: 'bg-blue-50',
            bgDark: 'bg-blue-500',
            bgIcon: 'bg-blue-100',
            text: 'text-blue-600',
            textDark: 'text-blue-700'
        },
        purple: {
            border: 'border-purple-500',
            bg: 'bg-purple-50',
            bgDark: 'bg-purple-500',
            bgIcon: 'bg-purple-100',
            text: 'text-purple-600',
            textDark: 'text-purple-700'
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-primary-50 to-primary-100/50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Payment</h2>
                            <p className="text-sm text-slate-600 mt-0.5">Select payment method and complete transaction</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/50 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Total Amount */}
                    <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 p-6">
                        <p className="text-sm font-medium text-primary-700 mb-2">Total Amount</p>
                        <p className="text-4xl font-bold text-primary-900">PKR {total.toFixed(2)}</p>
                    </div>

                    {/* Payment Methods */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-3">
                            Payment Method <span className="text-slate-500 font-normal">(Press 1, 2, or 3)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {PAYMENT_METHODS.map((method, index) => {
                                const Icon = method.icon;
                                const isSelected = selectedMethod === method.id;
                                const colors = colorClasses[method.color] || colorClasses.emerald;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`relative p-4 rounded-xl border-2 transition-all ${isSelected
                                                ? `${colors.border} ${colors.bg}`
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className={`absolute -top-2 -right-2 h-6 w-6 rounded-full ${colors.bgDark} flex items-center justify-center`}>
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className={`h-12 w-12 rounded-xl flex items-center justify-center ${isSelected ? colors.bgIcon : "bg-slate-100"
                                                    }`}
                                            >
                                                <Icon className={`h-6 w-6 ${isSelected ? colors.text : "text-slate-600"}`} />
                                            </div>
                                            <span className={`text-sm font-semibold ${isSelected ? colors.textDark : "text-slate-700"}`}>
                                                {method.label}
                                            </span>
                                            <span className="text-xs text-slate-500">{index + 1}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Amount Paid */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Amount Paid (PKR) <span className="text-red-500">*</span>
                        </label>
                        <input
                            ref={amountInputRef}
                            type="number"
                            step="0.01"
                            value={amountPaid}
                            onChange={(e) => {
                                setAmountPaid(e.target.value);
                                setError("");
                            }}
                            className={`w-full px-4 py-3 rounded-lg border-2 text-lg font-semibold focus:outline-none focus:ring-2 transition-colors ${error
                                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                                : "border-slate-200 focus:ring-primary-500/20 focus:border-primary-500"
                                }`}
                            placeholder="Enter amount paid"
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Quick Amount Buttons (for cash only) */}
                    {selectedMethod === "cash" && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Quick Amount</label>
                            <div className="grid grid-cols-3 gap-2">
                                {quickAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setAmountPaid(amount.toString())}
                                        className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-primary-500 text-sm font-semibold text-slate-700 hover:text-primary-700 transition-colors"
                                    >
                                        PKR {amount}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setAmountPaid(total.toString())}
                                    className="px-4 py-2 rounded-lg border border-primary-200 bg-primary-50 hover:bg-primary-100 text-sm font-semibold text-primary-700 transition-colors"
                                >
                                    Exact
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Change Calculation */}
                    {amountPaid && parseFloat(amountPaid) >= total && (
                        <div className="rounded-xl bg-emerald-50 border-2 border-emerald-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-700">Change to Return</p>
                                    <p className="text-xs text-emerald-600 mt-0.5">Customer will receive</p>
                                </div>
                                <p className="text-3xl font-bold text-emerald-700">PKR {change.toFixed(2)}</p>
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Total Amount</span>
                            <span className="font-semibold text-slate-900">PKR {total.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Amount Paid</span>
                            <span className="font-semibold text-slate-900">
                                PKR {parseFloat(amountPaid || 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-300">
                            <span className="font-semibold text-slate-700">Change</span>
                            <span className="font-bold text-emerald-600">PKR {change.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
                    >
                        Cancel (Esc)
                    </button>
                    <button
                        onClick={handleComplete}
                        disabled={!isValidPayment}
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                    >
                        Complete Payment (Enter)
                    </button>
                </div>
            </div>
        </div>
    );
}
