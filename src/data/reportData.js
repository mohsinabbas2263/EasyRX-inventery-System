/**
 * Mock Data for All Report Types
 * Comprehensive data for Sales, Inventory, Purchase, and Financial reports
 */

// ==================== SALES REPORT DATA ====================
export const SALES_REPORT_DATA = {
    summary: {
        totalRevenue: 342500,
        totalTransactions: 1024,
        totalItems: 3856,
        avgTransaction: 334.47,
        growth: {
            revenue: 14.7,
            transactions: 14.8,
            items: 18.8,
        },
    },
    dailySales: [
        { date: '2026-01-21', revenue: 11200, transactions: 34, items: 128 },
        { date: '2026-01-22', revenue: 12800, transactions: 38, items: 145 },
        { date: '2026-01-23', revenue: 10500, transactions: 31, items: 118 },
        { date: '2026-01-24', revenue: 13200, transactions: 41, items: 156 },
        { date: '2026-01-25', revenue: 11800, transactions: 36, items: 138 },
        { date: '2026-01-26', revenue: 12100, transactions: 35, items: 132 },
        { date: '2026-01-27', revenue: 12450, transactions: 37, items: 142 },
    ],
    topProducts: [
        { name: 'Paracetamol 500mg', sold: 245, revenue: 1225, trend: 12 },
        { name: 'Omeprazole 20mg', sold: 178, revenue: 2225, trend: 8 },
        { name: 'Cetirizine 10mg', sold: 156, revenue: 1248, trend: -3 },
        { name: 'Metformin 500mg', sold: 142, revenue: 923, trend: 15 },
        { name: 'Amoxicillin 500mg', sold: 128, revenue: 1920, trend: 5 },
    ],
    paymentMethods: [
        { method: 'Cash', count: 456, amount: 152340, percentage: 45 },
        { method: 'Card', count: 298, amount: 118920, percentage: 35 },
        { method: 'Digital Wallet', count: 270, amount: 71240, percentage: 20 },
    ],
};

// ==================== INVENTORY REPORT DATA ====================
export const INVENTORY_REPORT_DATA = {
    summary: {
        totalProducts: 1248,
        totalValue: 4567890,
        lowStockItems: 23,
        outOfStockItems: 8,
        expiringItems: 15,
        categories: 12,
    },
    stockByCategory: [
        { category: 'Prescription', items: 456, value: 2345000, percentage: 51 },
        { category: 'OTC', items: 342, value: 1234000, percentage: 27 },
        { category: 'Supplements', items: 256, value: 678000, percentage: 15 },
        { category: 'Medical Devices', items: 194, value: 310890, percentage: 7 },
    ],
    lowStockItems: [
        { name: 'ORS Sachet', current: 25, min: 100, reorder: 200, status: 'critical', value: 1250 },
        { name: 'Omeprazole 20mg', current: 45, min: 30, reorder: 100, status: 'warning', value: 5625 },
        { name: 'Ibuprofen 400mg', current: 0, min: 50, reorder: 150, status: 'critical', value: 0 },
        { name: 'Paracetamol 500mg', current: 55, min: 50, reorder: 200, status: 'warning', value: 275 },
        { name: 'Cetirizine 10mg', current: 12, min: 30, reorder: 100, status: 'critical', value: 96 },
    ],
    expiringItems: [
        { name: 'ORS Sachet', batch: 'B2392', expiry: '2026-01-31', days: 1, quantity: 50, value: 250 },
        { name: 'Omeprazole 20mg', batch: 'B2398', expiry: '2026-02-20', days: 21, quantity: 30, value: 3750 },
        { name: 'Vitamin C 500mg', batch: 'B2401', expiry: '2026-02-15', days: 16, quantity: 100, value: 1500 },
        { name: 'Amoxicillin 500mg', batch: 'B2405', expiry: '2026-03-10', days: 39, quantity: 75, value: 11250 },
    ],
    stockMovement: [
        { date: '2026-01-21', stockIn: 450, stockOut: 128, net: 322 },
        { date: '2026-01-22', stockIn: 320, stockOut: 145, net: 175 },
        { date: '2026-01-23', stockIn: 0, stockOut: 118, net: -118 },
        { date: '2026-01-24', stockIn: 580, stockOut: 156, net: 424 },
        { date: '2026-01-25', stockIn: 210, stockOut: 138, net: 72 },
        { date: '2026-01-26', stockIn: 0, stockOut: 132, net: -132 },
        { date: '2026-01-27', stockIn: 390, stockOut: 142, net: 248 },
    ],
};

// ==================== PURCHASE REPORT DATA ====================
export const PURCHASE_REPORT_DATA = {
    summary: {
        totalPurchases: 2450000,
        totalGRNs: 45,
        totalSuppliers: 12,
        pendingAmount: 345000,
        completedGRNs: 38,
        pendingGRNs: 5,
        rejectedGRNs: 2,
    },
    purchasesBySupplier: [
        { supplier: 'MediPharma Suppliers', grns: 18, amount: 1250000, pending: 125000, percentage: 51 },
        { supplier: 'HealthPlus Distributors', grns: 12, amount: 680000, pending: 95000, percentage: 28 },
        { supplier: 'PharmaCo International', grns: 10, amount: 380000, pending: 85000, percentage: 16 },
        { supplier: 'Others', grns: 5, amount: 140000, pending: 40000, percentage: 5 },
    ],
    recentGRNs: [
        {
            grnNumber: 'GRN-2026-045',
            supplier: 'MediPharma Suppliers',
            date: '2026-01-27',
            items: 5,
            amount: 125000,
            status: 'Completed'
        },
        {
            grnNumber: 'GRN-2026-044',
            supplier: 'HealthPlus Distributors',
            date: '2026-01-26',
            items: 8,
            amount: 95000,
            status: 'Pending'
        },
        {
            grnNumber: 'GRN-2026-043',
            supplier: 'PharmaCo International',
            date: '2026-01-25',
            items: 12,
            amount: 156000,
            status: 'Completed'
        },
        {
            grnNumber: 'GRN-2026-042',
            supplier: 'MediPharma Suppliers',
            date: '2026-01-24',
            items: 6,
            amount: 78000,
            status: 'Completed'
        },
        {
            grnNumber: 'GRN-2026-041',
            supplier: 'HealthPlus Distributors',
            date: '2026-01-23',
            items: 4,
            amount: 45000,
            status: 'Rejected'
        },
    ],
    monthlyPurchases: [
        { month: 'Jan', amount: 2450000, grns: 45 },
        { month: 'Dec', amount: 2120000, grns: 38 },
        { month: 'Nov', amount: 1980000, grns: 42 },
        { month: 'Oct', amount: 2340000, grns: 51 },
        { month: 'Sep', amount: 2150000, grns: 46 },
        { month: 'Aug', amount: 1890000, grns: 39 },
    ],
    paymentStatus: [
        { status: 'Paid', count: 38, amount: 2105000, percentage: 86 },
        { status: 'Pending', count: 5, amount: 295000, percentage: 12 },
        { status: 'Overdue', count: 2, amount: 50000, percentage: 2 },
    ],
};

// ==================== FINANCIAL REPORT DATA ====================
export const FINANCIAL_REPORT_DATA = {
    summary: {
        totalRevenue: 342500,
        totalCost: 245000,
        grossProfit: 97500,
        netProfit: 68250,
        profitMargin: 19.9,
        expenses: 29250,
    },
    profitLoss: [
        { category: 'Revenue', amount: 342500, percentage: 100, type: 'income' },
        { category: 'Cost of Goods Sold', amount: -245000, percentage: 71.5, type: 'expense' },
        { category: 'Gross Profit', amount: 97500, percentage: 28.5, type: 'income' },
        { category: 'Operating Expenses', amount: -29250, percentage: 8.5, type: 'expense' },
        { category: 'Net Profit', amount: 68250, percentage: 19.9, type: 'income' },
    ],
    expenseBreakdown: [
        { category: 'Salaries', amount: 15000, percentage: 51 },
        { category: 'Rent', amount: 8000, percentage: 27 },
        { category: 'Utilities', amount: 3250, percentage: 11 },
        { category: 'Marketing', amount: 2000, percentage: 7 },
        { category: 'Other', amount: 1000, percentage: 4 },
    ],
    monthlyProfit: [
        { month: 'Jan', revenue: 342500, cost: 245000, profit: 68250 },
        { month: 'Dec', revenue: 298700, cost: 215000, profit: 58590 },
        { month: 'Nov', revenue: 285400, cost: 205000, profit: 56378 },
        { month: 'Oct', revenue: 312000, cost: 225000, profit: 60900 },
        { month: 'Sep', revenue: 295000, cost: 212000, profit: 58100 },
        { month: 'Aug', revenue: 278000, cost: 200000, profit: 54600 },
    ],
    taxSummary: {
        salesTax: 54800,
        incomeTax: 13650,
        totalTax: 68450,
        netAfterTax: 54600,
    },
    cashFlow: [
        { date: '2026-01-21', inflow: 11200, outflow: 8500, net: 2700 },
        { date: '2026-01-22', inflow: 12800, outflow: 9200, net: 3600 },
        { date: '2026-01-23', inflow: 10500, outflow: 7800, net: 2700 },
        { date: '2026-01-24', inflow: 13200, outflow: 15000, net: -1800 },
        { date: '2026-01-25', inflow: 11800, outflow: 8900, net: 2900 },
        { date: '2026-01-26', inflow: 12100, outflow: 9100, net: 3000 },
        { date: '2026-01-27', inflow: 12450, outflow: 9300, net: 3150 },
    ],
};
