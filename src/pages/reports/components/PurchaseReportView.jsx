import React from 'react';
import { ShoppingCart, Building2, FileText, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function PurchaseReportView({ data }) {
    const maxAmount = Math.max(...data.purchasesBySupplier.map(s => s.amount));
    const maxMonthly = Math.max(...data.monthlyPurchases.map(m => m.amount));

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Purchases</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">PKR {(data.summary.totalPurchases / 1000000).toFixed(2)}M</p>
                    <p className="text-xs text-slate-500 mt-1">{data.summary.totalGRNs} GRNs</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{data.summary.completedGRNs}</p>
                    <p className="text-xs text-slate-500 mt-1">{data.summary.pendingGRNs} pending</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-amber-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Amount</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">PKR {(data.summary.pendingAmount / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-slate-500 mt-1">Outstanding payments</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suppliers</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{data.summary.totalSuppliers}</p>
                    <p className="text-xs text-slate-500 mt-1">Active vendors</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Purchases by Supplier */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Purchases by Supplier</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Top vendors</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {data.purchasesBySupplier.map((supplier, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{supplier.supplier}</p>
                                        <p className="text-xs text-slate-500">{supplier.grns} GRNs</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-teal-600">PKR {(supplier.amount / 1000).toFixed(0)}K</p>
                                        <p className="text-xs text-amber-600">Pending: PKR {(supplier.pending / 1000).toFixed(0)}K</p>
                                    </div>
                                </div>
                                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                                        style={{ width: `${(supplier.amount / maxAmount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Purchases Trend */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Monthly Trend</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {data.monthlyPurchases.map((month, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-xs font-medium text-slate-600 w-12">{month.month}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-end pr-3"
                                        style={{ width: `${(month.amount / maxMonthly) * 100}%` }}
                                    >
                                        <span className="text-xs font-semibold text-white">
                                            PKR {(month.amount / 1000).toFixed(0)}K
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-500 w-12 text-right">{month.grns} GRNs</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent GRNs */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Recent GRNs</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Latest transactions</p>
                        </div>
                    </div>

                    <div className="p-5 space-y-3">
                        {data.recentGRNs.map((grn, index) => (
                            <div
                                key={index}
                                className="p-3 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{grn.grnNumber}</p>
                                        <p className="text-xs text-slate-500">{grn.supplier}</p>
                                    </div>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${grn.status === 'Completed'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : grn.status === 'Pending'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {grn.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-600">{grn.date} • {grn.items} items</span>
                                    <span className="font-semibold text-slate-900">PKR {grn.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Status */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Payment Status</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Outstanding summary</p>
                        </div>
                    </div>

                    <div className="p-5 space-y-4">
                        {data.paymentStatus.map((payment, index) => {
                            const icons = { Paid: CheckCircle, Pending: Clock, Overdue: XCircle };
                            const colors = {
                                Paid: 'emerald',
                                Pending: 'amber',
                                Overdue: 'red',
                            };
                            // Static color classes map for Tailwind JIT compilation
                            const colorClasses = {
                                emerald: {
                                    icon: 'text-emerald-600',
                                    gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
                                },
                                amber: {
                                    icon: 'text-amber-600',
                                    gradient: 'bg-gradient-to-r from-amber-500 to-amber-600',
                                },
                                red: {
                                    icon: 'text-red-600',
                                    gradient: 'bg-gradient-to-r from-red-500 to-red-600',
                                },
                            };
                            const Icon = icons[payment.status];
                            const color = colors[payment.status];
                            const classes = colorClasses[color];

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`h-4 w-4 ${classes.icon}`} />
                                            <span className="text-sm font-medium text-slate-900">{payment.status}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900">
                                                PKR {(payment.amount / 1000).toFixed(0)}K
                                            </p>
                                            <p className="text-xs text-slate-500">{payment.count} transactions</p>
                                        </div>
                                    </div>
                                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`absolute inset-y-0 left-0 ${classes.gradient} rounded-full`}
                                            style={{ width: `${payment.percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 text-right">{payment.percentage}% of total</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
