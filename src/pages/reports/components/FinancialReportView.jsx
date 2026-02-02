import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Receipt } from 'lucide-react';

export default function FinancialReportView({ data }) {
    const maxProfit = Math.max(...data.monthlyProfit.map(m => m.profit));
    const maxExpense = Math.max(...data.expenseBreakdown.map(e => e.amount));

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">PKR {(data.summary.totalRevenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-slate-500 mt-1">This month</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Profit</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">PKR {(data.summary.grossProfit / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-slate-500 mt-1">{data.summary.profitMargin.toFixed(1)}% margin</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Profit</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">PKR {(data.summary.netProfit / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-slate-500 mt-1">After expenses</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Receipt className="h-6 w-6 text-amber-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tax</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">PKR {(data.taxSummary.totalTax / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-slate-500 mt-1">Sales + Income tax</p>
                </div>
            </div>

            {/* Profit & Loss Statement */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">Profit & Loss Statement</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Financial summary</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {data.profitLoss.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg ${item.type === 'income' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.type === 'income' ? (
                                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                                ) : (
                                    <TrendingDown className="h-5 w-5 text-red-600" />
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{item.category}</p>
                                    <p className="text-xs text-slate-500">{item.percentage.toFixed(1)}% of revenue</p>
                                </div>
                            </div>
                            <p
                                className={`text-lg font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                    }`}
                            >
                                {item.amount >= 0 ? '+' : ''}PKR {Math.abs(item.amount).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Breakdown */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                            <PieChart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Expense Breakdown</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Operating costs</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {data.expenseBreakdown.map((expense, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-900">{expense.category}</p>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-purple-600">PKR {expense.amount.toLocaleString()}</p>
                                        <p className="text-xs text-slate-500">{expense.percentage}% of total</p>
                                    </div>
                                </div>
                                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                                        style={{ width: `${(expense.amount / maxExpense) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Profit Trend */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Monthly Profit</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {data.monthlyProfit.map((month, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-xs font-medium text-slate-600 w-12">{month.month}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-end pr-3"
                                        style={{ width: `${(month.profit / maxProfit) * 100}%` }}
                                    >
                                        <span className="text-xs font-semibold text-white">
                                            PKR {(month.profit / 1000).toFixed(0)}K
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right w-24">
                                    <p className="text-xs text-emerald-600 font-semibold">
                                        {((month.profit / month.revenue) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cash Flow */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">Cash Flow</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Last 7 days</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {data.cashFlow.map((day, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <span className="text-xs font-medium text-slate-600 w-20">{day.date.slice(5)}</span>
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                                    <p className="text-xs text-slate-500">Inflow</p>
                                    <p className="text-sm font-semibold text-emerald-600">PKR {day.inflow.toLocaleString()}</p>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                                    <p className="text-xs text-slate-500">Outflow</p>
                                    <p className="text-sm font-semibold text-red-600">PKR {day.outflow.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="text-right w-24">
                                <p className="text-xs text-slate-500">Net</p>
                                <p
                                    className={`text-sm font-bold ${day.net >= 0 ? 'text-emerald-600' : 'text-red-600'
                                        }`}
                                >
                                    {day.net >= 0 ? '+' : ''}PKR {day.net.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
