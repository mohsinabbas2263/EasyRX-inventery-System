import React from 'react';
import { DollarSign, ShoppingCart, Package, Activity, TrendingUp, TrendingDown, BarChart3, PieChart, CreditCard, Banknote, Smartphone } from 'lucide-react';

export default function SalesReportView({ data }) {
    const maxRevenue = Math.max(...data.dailySales.map(d => d.revenue));

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            <TrendingUp className="h-3 w-3" />
                            {data.summary.growth.revenue.toFixed(1)}%
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">PKR {data.summary.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Total sales</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            <TrendingUp className="h-3 w-3" />
                            {data.summary.growth.transactions.toFixed(1)}%
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Transactions</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{data.summary.totalTransactions}</p>
                    <p className="text-xs text-slate-500 mt-1">Total sales completed</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Package className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            <TrendingUp className="h-3 w-3" />
                            {data.summary.growth.items.toFixed(1)}%
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Items Sold</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{data.summary.totalItems}</p>
                    <p className="text-xs text-slate-500 mt-1">Total units moved</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Activity className="h-6 w-6 text-amber-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Transaction</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">PKR {data.summary.avgTransaction.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 mt-1">Per sale average</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Trend Chart */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Sales Trend</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Last 7 days revenue</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {data.dailySales.map((day, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-xs font-medium text-slate-600 w-16">{day.date.slice(5)}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-end pr-3"
                                        style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                                    >
                                        <span className="text-xs font-semibold text-white">
                                            PKR {day.revenue.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-500 w-12 text-right">{day.transactions}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Methods Distribution */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                            <PieChart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Payment Methods</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Distribution by method</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {data.paymentMethods.map((method, index) => {
                            const icons = { Cash: Banknote, Card: CreditCard, 'Digital Wallet': Smartphone };
                            const colors = {
                                Cash: 'emerald',
                                Card: 'blue',
                                'Digital Wallet': 'purple',
                            };
                            // Static color classes map for Tailwind JIT compilation
                            const colorClasses = {
                                emerald: {
                                    icon: 'text-emerald-600',
                                    gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
                                },
                                blue: {
                                    icon: 'text-blue-600',
                                    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
                                },
                                purple: {
                                    icon: 'text-purple-600',
                                    gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
                                },
                            };
                            const Icon = icons[method.method];
                            const color = colors[method.method];
                            const classes = colorClasses[color];

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`h-4 w-4 ${classes.icon}`} />
                                            <span className="text-sm font-medium text-slate-900">{method.method}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900">
                                                PKR {method.amount.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-slate-500">{method.count} transactions</p>
                                        </div>
                                    </div>
                                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`absolute inset-y-0 left-0 ${classes.gradient} rounded-full`}
                                            style={{ width: `${method.percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 text-right">{method.percentage}% of total</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">Top Products</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Best sellers this period</p>
                    </div>
                </div>

                <div className="p-5">
                    <div className="space-y-3">
                        {data.topProducts.map((product, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700 font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                                        <p className="text-xs text-slate-500">{product.sold} units sold</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-teal-600">PKR {product.revenue.toLocaleString()}</p>
                                    <div className={`flex items-center gap-1 text-xs font-semibold ${product.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {product.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {Math.abs(product.trend)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
