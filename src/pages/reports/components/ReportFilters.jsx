import React from 'react';
import { Filter, Calendar, Package, Building2, Tag, Search } from 'lucide-react';
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';

export default function ReportFilters({
    role = 'Admin',
    reportType,
    onReportTypeChange,
    dateRange,
    onDateRangeChange,
    filters,
    onFiltersChange
}) {
    const permissions = usePermissions(role);

    const allReportTypes = [
        { value: 'sales', label: 'Sales Report', icon: '💰', permission: PERMISSIONS.REPORTS_SALES },
        { value: 'inventory', label: 'Inventory Report', icon: '📦', permission: PERMISSIONS.REPORTS_INVENTORY },
        { value: 'purchase', label: 'Purchase Report', icon: '🛒', permission: PERMISSIONS.REPORTS_PURCHASE },
        { value: 'financial', label: 'Financial Report', icon: '💵', permission: PERMISSIONS.REPORTS_FINANCIAL },
    ];

    // Filter report types based on permissions
    const reportTypes = allReportTypes.filter(type => permissions.has(type.permission));

    const quickDatePresets = [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'This Week', value: 'thisWeek' },
        { label: 'Last Week', value: 'lastWeek' },
        { label: 'This Month', value: 'thisMonth' },
        { label: 'Last Month', value: 'lastMonth' },
        { label: 'This Quarter', value: 'thisQuarter' },
        { label: 'This Year', value: 'thisYear' },
    ];

    const handleQuickDate = (preset) => {
        const today = new Date();
        let start, end;

        switch (preset) {
            case 'today':
                start = end = today.toISOString().split('T')[0];
                break;
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                start = end = yesterday.toISOString().split('T')[0];
                break;
            case 'thisWeek':
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                start = weekStart.toISOString().split('T')[0];
                end = today.toISOString().split('T')[0];
                break;
            case 'lastWeek':
                const lastWeekEnd = new Date(today);
                lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
                const lastWeekStart = new Date(lastWeekEnd);
                lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
                start = lastWeekStart.toISOString().split('T')[0];
                end = lastWeekEnd.toISOString().split('T')[0];
                break;
            case 'thisMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                end = today.toISOString().split('T')[0];
                break;
            case 'lastMonth':
                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
                start = lastMonth.toISOString().split('T')[0];
                end = lastMonthEnd.toISOString().split('T')[0];
                break;
            case 'thisQuarter':
                const quarter = Math.floor(today.getMonth() / 3);
                start = new Date(today.getFullYear(), quarter * 3, 1).toISOString().split('T')[0];
                end = today.toISOString().split('T')[0];
                break;
            case 'thisYear':
                start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                end = today.toISOString().split('T')[0];
                break;
            default:
                return;
        }

        onDateRangeChange({ start, end });
    };

    return (
        <div className="space-y-4">
            {/* Report Type Selector */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-5 w-5 text-teal-600" />
                    <h3 className="text-sm font-semibold text-slate-900">Report Type</h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {reportTypes.map((type) => (
                        <button
                            key={type.value}
                            onClick={() => onReportTypeChange(type.value)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${reportType === type.value
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/50'
                                }`}
                        >
                            <div className="text-2xl mb-2">{type.icon}</div>
                            <p className={`text-sm font-semibold ${reportType === type.value ? 'text-teal-700' : 'text-slate-900'
                                }`}>
                                {type.label}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Date Filters */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    <h3 className="text-sm font-semibold text-slate-900">Date Range</h3>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {quickDatePresets.map((preset) => (
                        <button
                            key={preset.value}
                            onClick={() => handleQuickDate(preset.value)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-300 text-xs font-medium text-slate-700 hover:text-teal-700 transition-all"
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                {/* Custom Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Additional Filters (based on report type) */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-teal-600" />
                    <h3 className="text-sm font-semibold text-slate-900">Additional Filters</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    {(reportType === 'sales' || reportType === 'inventory') && (
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category || ''}
                                onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                            >
                                <option value="">All Categories</option>
                                <option value="prescription">Prescription</option>
                                <option value="otc">OTC</option>
                                <option value="supplements">Supplements</option>
                                <option value="medical">Medical Devices</option>
                            </select>
                        </div>
                    )}

                    {/* Supplier Filter */}
                    {(reportType === 'purchase' || reportType === 'inventory') && (
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-2">
                                Supplier
                            </label>
                            <select
                                value={filters.supplier || ''}
                                onChange={(e) => onFiltersChange({ ...filters, supplier: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                            >
                                <option value="">All Suppliers</option>
                                <option value="medipharma">MediPharma Suppliers</option>
                                <option value="healthplus">HealthPlus Distributors</option>
                                <option value="pharmaco">PharmaCo International</option>
                            </select>
                        </div>
                    )}

                    {/* Status Filter */}
                    {reportType === 'purchase' && (
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status || ''}
                                onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                            >
                                <option value="">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    )}

                    {/* Stock Status Filter */}
                    {reportType === 'inventory' && (
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-2">
                                Stock Status
                            </label>
                            <select
                                value={filters.stockStatus || ''}
                                onChange={(e) => onFiltersChange({ ...filters, stockStatus: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                            >
                                <option value="">All Stock</option>
                                <option value="inStock">In Stock</option>
                                <option value="lowStock">Low Stock</option>
                                <option value="outOfStock">Out of Stock</option>
                            </select>
                        </div>
                    )}

                    {/* Search */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-2">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={filters.search || ''}
                                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
