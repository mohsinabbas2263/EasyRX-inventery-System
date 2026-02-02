# 📚 EAZYRX FRONTEND - DEVELOPER DOCUMENTATION

## 🎯 Overview

**Project**: EazyRX Pharmacy Management System  
**Type**: Desktop & Web Application  
**Framework**: React 18 + Vite + Electron  
**Styling**: Tailwind CSS  
**Language**: JavaScript (JSX)

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Core Features](#core-features)
4. [Components](#components)
5. [Permissions System](#permissions-system)
6. [Routing](#routing)
7. [Styling](#styling)
8. [Best Practices](#best-practices)

---

## 🚀 Getting Started

### **Prerequisites**:
```bash
Node.js >= 16.x
npm >= 8.x
```

### **Installation**:
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project
cd eazyrx-frontend

# Install dependencies
npm install
```

### **Development**:
```bash
# Run web app
npm run dev

# Run desktop app
npm run electron:dev

# Build for production
npm run build

# Build desktop app
npm run electron:build
```

---

## 📁 Project Structure

```
eazyrx-frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── LoadingSpinner.jsx
│   │   ├── SkeletonCard.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── LoadingOverlay.jsx
│   │   ├── PermissionGuard.jsx
│   │   └── PermissionDenied.jsx
│   │
│   ├── pages/               # Page components
│   │   ├── auth/
│   │   │   ├── LoginWeb.jsx
│   │   │   └── LoginDesktop.jsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── components/
│   │   │       ├── Sidebar.jsx
│   │   │       └── StatsCard.jsx
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── suppliers/
│   │   ├── grn/
│   │   ├── pos/
│   │   └── reports/
│   │       ├── Reports.jsx
│   │       └── components/
│   │           ├── ExportMenu.jsx
│   │           ├── ReportFilters.jsx
│   │           ├── SalesReportView.jsx
│   │           ├── InventoryReportView.jsx
│   │           ├── PurchaseReportView.jsx
│   │           └── FinancialReportView.jsx
│   │
│   ├── hooks/               # Custom hooks
│   │   └── usePermissions.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── permissions.js
│   │   └── exportUtils.js
│   │
│   ├── data/                # Mock data
│   │   └── reportData.js
│   │
│   ├── theme.js             # Theme configuration
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
│
├── electron/                # Electron configuration
│   └── main.js
│
├── public/                  # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
└── electron-builder.json
```

---

## 🎯 Core Features

### **1. Authentication**
- Web & Desktop login pages
- Role-based authentication (Admin, Pharmacist, Cashier)
- Session management

### **2. Dashboard**
- Real-time statistics
- Low stock alerts
- Recent activity feed
- Quick actions

### **3. Products Management**
- CRUD operations
- Category management
- Search & filters
- Batch tracking

### **4. Inventory Management**
- Stock in/out operations
- Batch management
- Expiry tracking
- Stock alerts

### **5. Purchase Management**
- Purchase orders
- GRN (Goods Receipt Note)
- Supplier management
- Approval workflow

### **6. Point of Sale (POS)**
- Sales interface
- Barcode scanning
- Receipt printing
- Payment processing

### **7. Reports & Analytics**
- Sales reports
- Inventory reports
- Purchase reports
- Financial reports
- Export (CSV, Excel, PDF)

### **8. Permissions System**
- Role-based access control
- UI hiding based on permissions
- 24 granular permissions

---

## 🧩 Components

### **Reusable Components**:

#### **LoadingSpinner**
```jsx
import LoadingSpinner from '../components/LoadingSpinner';

<LoadingSpinner size="large" text="Loading..." />
<LoadingSpinner color="primary" />
```

#### **SkeletonCard**
```jsx
import SkeletonCard, { SkeletonGrid } from '../components/SkeletonCard';

<SkeletonCard variant="stats" />
<SkeletonGrid count={4} variant="stats" cols={4} />
```

#### **EmptyState**
```jsx
import EmptyState, { EmptyProducts } from '../components/EmptyState';

<EmptyState
    icon={Package}
    title="No products"
    description="Add your first product"
    actionLabel="Add Product"
    onAction={handleAdd}
/>

<EmptyProducts onAdd={handleAdd} />
```

#### **ErrorBoundary**
```jsx
import ErrorBoundary from '../components/ErrorBoundary';

<ErrorBoundary>
    <YourApp />
</ErrorBoundary>
```

#### **PermissionGuard**
```jsx
import { Hide, Show, Disable } from '../components/PermissionGuard';

<Hide role={role} permission={PERMISSIONS.PRODUCTS_DELETE}>
    <button>Delete</button>
</Hide>
```

---

## 🔐 Permissions System

### **Roles**:
```javascript
- Admin: Full access
- Pharmacist: Limited access
- Cashier: Minimal access
```

### **Using Permissions**:

#### **1. In Components**:
```jsx
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../utils/permissions';

function MyComponent() {
    const permissions = usePermissions(role);

    if (permissions.has(PERMISSIONS.PRODUCTS_DELETE)) {
        return <DeleteButton />;
    }

    return null;
}
```

#### **2. With Permission Guards**:
```jsx
<Hide role={role} permission={PERMISSIONS.PRODUCTS_DELETE}>
    <DeleteButton />
</Hide>
```

#### **3. Sidebar Filtering**:
```jsx
const accessibleNavItems = navItems.filter(item => 
    permissions.has(item.permission)
);
```

### **Available Permissions**:
```javascript
// Dashboard
DASHBOARD_VIEW, DASHBOARD_FULL

// Products
PRODUCTS_VIEW, PRODUCTS_CREATE, PRODUCTS_UPDATE, PRODUCTS_DELETE

// Inventory
INVENTORY_VIEW, INVENTORY_MANAGE, INVENTORY_ADJUST

// Suppliers
SUPPLIERS_VIEW, SUPPLIERS_MANAGE

// GRN
GRN_VIEW, GRN_CREATE, GRN_APPROVE, GRN_REJECT

// POS
POS_ACCESS, POS_DISCOUNT, POS_REFUND

// Reports
REPORTS_VIEW, REPORTS_SALES, REPORTS_INVENTORY, 
REPORTS_PURCHASE, REPORTS_FINANCIAL, REPORTS_EXPORT

// Settings
SETTINGS_VIEW, SETTINGS_MANAGE
```

---

## 🛣️ Routing

### **Main Routes**:
```javascript
/login/web          - Web login
/login/desktop      - Desktop login
/dashboard          - Main dashboard
/products           - Products management
/inventory          - Inventory management
/suppliers          - Suppliers management
/grn                - GRN management
/pos                - Point of Sale
/reports            - Reports & Analytics
/settings           - Settings
```

### **Adding New Routes**:
```jsx
// In App.jsx
<Route path="/new-page" element={<NewPage />} />
```

---

## 🎨 Styling

### **Tailwind CSS**:
The project uses Tailwind CSS for styling.

#### **Theme Colors**:
```javascript
// Primary (Teal)
bg-teal-50, bg-teal-600, bg-teal-700
text-teal-600, text-teal-700
border-teal-200, border-teal-500

// Secondary (Slate)
bg-slate-50, bg-slate-100, bg-slate-900
text-slate-500, text-slate-700, text-slate-900
border-slate-200, border-slate-300
```

#### **Common Patterns**:
```jsx
// Card
<div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">

// Button Primary
<button className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors">

// Button Secondary
<button className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors">

// Input
<input className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors" />
```

---

## ✅ Best Practices

### **1. Component Structure**:
```jsx
// Import React and dependencies
import React, { useState } from 'react';

// Import components
import Sidebar from './components/Sidebar';

// Import utilities
import { PERMISSIONS } from '../utils/permissions';

// Component
export default function MyComponent() {
    // State
    const [data, setData] = useState([]);

    // Handlers
    const handleClick = () => {
        // Logic
    };

    // Render
    return (
        <div>
            {/* Content */}
        </div>
    );
}
```

### **2. State Management**:
```jsx
// Use useState for local state
const [loading, setLoading] = useState(false);

// Use useMemo for computed values
const filteredData = useMemo(() => {
    return data.filter(item => item.active);
}, [data]);
```

### **3. Error Handling**:
```jsx
// Wrap app in ErrorBoundary
<ErrorBoundary>
    <App />
</ErrorBoundary>

// Show loading states
{loading ? <LoadingSpinner /> : <Content />}

// Show empty states
{data.length === 0 ? <EmptyState /> : <DataList />}
```

### **4. Permissions**:
```jsx
// Always check permissions
const permissions = usePermissions(role);

if (!permissions.has(PERMISSIONS.FEATURE)) {
    return <PermissionDenied />;
}
```

### **5. Responsive Design**:
```jsx
// Use Tailwind responsive classes
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
```

---

## 🔧 Utility Functions

### **Export Utils**:
```javascript
import { exportSalesReport } from '../utils/exportUtils';

// Export to CSV
exportSalesReport(data, 'csv');

// Export to Excel
exportSalesReport(data, 'excel');

// Export to PDF
exportSalesReport(data, 'pdf');
```

### **Permission Utils**:
```javascript
import { hasPermission, isAdmin } from '../utils/permissions';

// Check permission
if (hasPermission(role, PERMISSIONS.PRODUCTS_DELETE)) {
    // Allow delete
}

// Check role
if (isAdmin(role)) {
    // Admin-only feature
}
```

---

## 📊 Data Flow

### **Mock Data** (Current):
```javascript
// Located in src/data/
import { SALES_REPORT_DATA } from '../data/reportData';
```

### **API Integration** (Future):
```javascript
// Fetch data from API
const fetchData = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    return data;
};
```

---

## 🐛 Debugging

### **Development Tools**:
```bash
# Check console for errors
# Use React DevTools
# Use Tailwind CSS IntelliSense
```

### **Common Issues**:

**Issue**: Component not rendering  
**Solution**: Check ErrorBoundary, console errors

**Issue**: Styles not applying  
**Solution**: Check Tailwind classes, rebuild

**Issue**: Permission not working  
**Solution**: Check role prop, permission constants

---

## 🚀 Deployment

### **Web Build**:
```bash
npm run build
# Output: dist/
```

### **Desktop Build**:
```bash
npm run electron:build
# Output: dist-electron/
```

---

## 📝 Contributing

### **Code Style**:
- Use functional components
- Use hooks for state
- Follow naming conventions
- Add comments for complex logic
- Keep components small and focused

### **Git Workflow**:
```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature
```

---

## 📞 Support

For issues or questions:
- Check documentation
- Review code examples
- Contact development team

---

**Built with ❤️ for EazyRX**  
**Last Updated**: 2026-01-30
