import React from 'react';
import { Package, AlertTriangle, Clock, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function InventoryReportView({ data }) {
    const maxValue = Math.max(...data.stockByCategory.map(c => c.value));
    const maxMovement = Math.max(...data.stockMovement.map(m => Math.abs(m.net)));

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Package className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Products</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{data.summary.totalProducts.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">{data.summary.categories} categories</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Value</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">PKR {(data.summary.totalValue / 1000000).toFixed(2)}M</p>
                    <p className="text-xs text-slate-500 mt-1">Inventory worth</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-amber-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{data.summary.lowStockItems}</p>
                    <p className="text-xs text-slate-500 mt-1">{data.summary.outOfStockItems} out of stock</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiring Soon</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{data.summary.expiringItems}</p>
                    <p className="text-xs text-slate-500 mt-1">Within 30 days</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stock by Category */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Stock by Category</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Inventory distribution</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {data.stockByCategory.map((cat, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{cat.category}</p>
                                        <p className="text-xs text-slate-500">{cat.items} items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-teal-600">PKR {(cat.value / 1000).toFixed(0)}K</p>
                                        <p className="text-xs text-slate-500">{cat.percentage}% of total</p>
                                    </div>
                                </div>
                                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                                        style={{ width: `${(cat.value / maxValue) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stock Movement */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Stock Movement</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Last 7 days</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {data.stockMovement.map((day, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-xs font-medium text-slate-600 w-20">{day.date.slice(5)}</span>
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                                        <div
                                            className={`absolute inset-y-0 ${day.net >= 0 ? 'left-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600' : 'right-1/2 bg-gradient-to-l from-red-500 to-red-600'} flex items-center ${day.net >= 0 ? 'justify-end pr-2' : 'justify-start pl-2'}`}
                                            style={{ width: `${(Math.abs(day.net) / maxMovement) * 50}%` }}
                                        >
                                            <span className="text-xs font-semibold text-white">
                                                {day.net >= 0 ? '+' : ''}{day.net}
                                            </span>
                                        </div>
                                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300" />
                                    </div>
                                </div>
                                <div className="text-right w-24">
                                    <p className="text-xs text-slate-500">In: {day.stockIn}</p>
                                    <p className="text-xs text-slate-500">Out: {day.stockOut}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Items */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Low Stock Items</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Requires reordering</p>
                        </div>
                    </div>

                    <div className="p-5 space-y-3">
                        {data.lowStockItems.map((item, index) => (
                            <div
                                key={index}
                                className="p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.status === 'critical'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-600">
                                        Stock: {item.current}/{item.min} (Reorder: {item.reorder})
                                    </span>
                                    <span className="font-semibold text-slate-900">PKR {item.value.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expiring Items */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Expiring Soon</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Within 30 days</p>
                        </div>
                    </div>

                    <div className="p-5 space-y-3">
                        {data.expiringItems.map((item, index) => (
                            <div
                                key={index}
                                className="p-3 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                        <p className="text-xs text-slate-500">Batch: {item.batch}</p>
                                    </div>
                                    <span className="text-xs font-semibold text-red-600">{item.days} days</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-600">Expiry: {item.expiry}</span>
                                    <span className="text-slate-600">Qty: {item.quantity} (PKR {item.value.toLocaleString()})</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
