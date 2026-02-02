import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";
import Sidebar from "../dashboard/components/Sidebar";
import ExportMenu from "./components/ExportMenu";
import ReportFilters from "./components/ReportFilters";
import SalesReportView from "./components/SalesReportView";
import InventoryReportView from "./components/InventoryReportView";
import PurchaseReportView from "./components/PurchaseReportView";
import FinancialReportView from "./components/FinancialReportView";
import { exportSalesReport } from "../../utils/exportUtils";
import { usePermissions } from "../../hooks/usePermissions";
import { PERMISSIONS as PERMS } from "../../utils/permissions";
import {
    SALES_REPORT_DATA,
    INVENTORY_REPORT_DATA,
    PURCHASE_REPORT_DATA,
    FINANCIAL_REPORT_DATA
} from "../../data/reportData";

export default function Reports() {
    const navigate = useNavigate();
    const [demoRole, setDemoRole] = useState("Admin");
    const permissions = usePermissions(demoRole);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [reportType, setReportType] = useState("sales");
    const [filters, setFilters] = useState({
        category: "",
        supplier: "",
        status: "",
        stockStatus: "",
        search: "",
    });

    const roleBadge = useMemo(() => {
        if (demoRole === "Admin")
            return { label: "Admin • Full Access", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
        if (demoRole === "Pharmacist")
            return { label: "Pharmacist • Limited Access", cls: "bg-blue-50 text-blue-700 border-blue-200" };
        return { label: "Cashier • Limited Access", cls: "bg-amber-50 text-amber-700 border-amber-200" };
    }, [demoRole]);

    const handleLogout = () => navigate("/login/web");

    const handleExport = (format) => {
        // Get current report data
        let exportData = [];

        switch (reportType) {
            case 'sales':
                exportData = SALES_REPORT_DATA.dailySales.map(day => ({
                    Date: day.date,
                    Revenue: `PKR ${day.revenue.toLocaleString()}`,
                    Transactions: day.transactions,
                    Items: day.items,
                }));
                break;
            case 'inventory':
                exportData = INVENTORY_REPORT_DATA.stockByCategory.map(cat => ({
                    Category: cat.category,
                    Items: cat.items,
                    Value: `PKR ${cat.value.toLocaleString()}`,
                    Percentage: `${cat.percentage}%`,
                }));
                break;
            case 'purchase':
                exportData = PURCHASE_REPORT_DATA.recentGRNs.map(grn => ({
                    'GRN Number': grn.grnNumber,
                    Supplier: grn.supplier,
                    Date: grn.date,
                    Items: grn.items,
                    Amount: `PKR ${grn.amount.toLocaleString()}`,
                    Status: grn.status,
                }));
                break;
            case 'financial':
                exportData = FINANCIAL_REPORT_DATA.profitLoss.map(item => ({
                    Category: item.category,
                    Amount: `PKR ${Math.abs(item.amount).toLocaleString()}`,
                    Percentage: `${item.percentage.toFixed(1)}%`,
                    Type: item.type,
                }));
                break;
            default:
                exportData = [];
        }

        exportSalesReport(exportData, format);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex min-h-screen">
                <Sidebar role={demoRole} />

                <main className="flex-1">
                    {/* Header */}
                    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
                                <p className="text-sm text-slate-500 mt-0.5">Business insights and performance metrics</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Role Selector */}
                                <div className="relative">
                                    <select
                                        value={demoRole}
                                        onChange={(e) => setDemoRole(e.target.value)}
                                        className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer transition-colors"
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
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
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
                        {/* Filters */}
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <ReportFilters
                                    role={demoRole}
                                    reportType={reportType}
                                    onReportTypeChange={setReportType}
                                    dateRange={dateRange}
                                    onDateRangeChange={setDateRange}
                                    filters={filters}
                                    onFiltersChange={setFilters}
                                />
                            </div>
                            <div className="flex-shrink-0">
                                <ExportMenu
                                    onExport={handleExport}
                                    reportType={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`}
                                />
                            </div>
                        </div>

                        {/* Report Content - Conditional Rendering with Permissions */}
                        {reportType === 'sales' && permissions.has(PERMS.REPORTS_SALES) && <SalesReportView data={SALES_REPORT_DATA} />}
                        {reportType === 'inventory' && permissions.has(PERMS.REPORTS_INVENTORY) && <InventoryReportView data={INVENTORY_REPORT_DATA} />}
                        {reportType === 'purchase' && permissions.has(PERMS.REPORTS_PURCHASE) && <PurchaseReportView data={PURCHASE_REPORT_DATA} />}
                        {reportType === 'financial' && permissions.has(PERMS.REPORTS_FINANCIAL) && <FinancialReportView data={FINANCIAL_REPORT_DATA} />}

                        {/* Permission Denied Message */}
                        {((reportType === 'purchase' && !permissions.has(PERMS.REPORTS_PURCHASE)) ||
                            (reportType === 'financial' && !permissions.has(PERMS.REPORTS_FINANCIAL))) && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                                            <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Access Restricted</h3>
                                    <p className="text-sm text-slate-600 mb-4">
                                        You don't have permission to view this report type.
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Current Role: <span className="font-semibold">{demoRole}</span>
                                    </p>
                                </div>
                            )}
                    </div>
                </main>
            </div>
        </div>
    );
}
