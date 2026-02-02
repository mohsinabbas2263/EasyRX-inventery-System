# 🔗 BACKEND INTEGRATION GUIDE

## 📋 Overview

**Guide**: How to connect EazyRX Frontend with Backend  
**For**: Backend Developer / Integration Team  
**Date**: January 30, 2026

---

## 🎯 **INTEGRATION PROCESS**

### **Step-by-Step Backend Connection**

---

## 📊 **PHASE 1: SETUP & CONFIGURATION**

### **1. Install Required Packages**

```bash
# Navigate to frontend project
cd eazyrx-frontend

# Install Axios for API calls
npm install axios

# Install environment variables support (if not already installed)
npm install dotenv
```

### **2. Create Environment Configuration**

Create `.env` file in root directory:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_JWT_SECRET=your-secret-key

# Environment
VITE_ENV=development
```

**Note**: Add `.env` to `.gitignore` to keep secrets safe!

---

## 🔧 **PHASE 2: API SERVICE SETUP**

### **1. Create API Service File**

**File**: `src/services/api.js`

```javascript
import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - redirect to login
            localStorage.removeItem('authToken');
            window.location.href = '/login/web';
        }
        return Promise.reject(error);
    }
);

export default api;
```

---

### **2. Create API Endpoints File**

**File**: `src/services/endpoints.js`

```javascript
import api from './api';

// ==================== AUTHENTICATION ====================
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    verifyToken: () => api.get('/auth/verify'),
};

// ==================== PRODUCTS ====================
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    search: (query) => api.get('/products/search', { params: { q: query } }),
};

// ==================== INVENTORY ====================
export const inventoryAPI = {
    getAll: (params) => api.get('/inventory', { params }),
    getById: (id) => api.get(`/inventory/${id}`),
    stockIn: (data) => api.post('/inventory/stock-in', data),
    stockOut: (data) => api.post('/inventory/stock-out', data),
    getBatches: (productId) => api.get(`/inventory/batches/${productId}`),
    getLowStock: () => api.get('/inventory/low-stock'),
    getExpiring: () => api.get('/inventory/expiring'),
};

// ==================== PURCHASES ====================
export const purchasesAPI = {
    getAll: (params) => api.get('/purchases', { params }),
    getById: (id) => api.get(`/purchases/${id}`),
    create: (data) => api.post('/purchases', data),
    update: (id, data) => api.put(`/purchases/${id}`, data),
    delete: (id) => api.delete(`/purchases/${id}`),
};

// ==================== GRN ====================
export const grnAPI = {
    getAll: (params) => api.get('/grn', { params }),
    getById: (id) => api.get(`/grn/${id}`),
    create: (data) => api.post('/grn', data),
    approve: (id) => api.post(`/grn/${id}/approve`),
    reject: (id, reason) => api.post(`/grn/${id}/reject`, { reason }),
};

// ==================== POS / SALES ====================
export const salesAPI = {
    getAll: (params) => api.get('/sales', { params }),
    getById: (id) => api.get(`/sales/${id}`),
    create: (data) => api.post('/sales', data),
    getReceipt: (id) => api.get(`/sales/${id}/receipt`),
};

// ==================== REPORTS ====================
export const reportsAPI = {
    getSalesReport: (params) => api.get('/reports/sales', { params }),
    getInventoryReport: (params) => api.get('/reports/inventory', { params }),
    getPurchaseReport: (params) => api.get('/reports/purchase', { params }),
    getFinancialReport: (params) => api.get('/reports/financial', { params }),
    exportReport: (type, format, params) => 
        api.get(`/reports/${type}/export/${format}`, { params, responseType: 'blob' }),
};

// ==================== SUPPLIERS ====================
export const suppliersAPI = {
    getAll: (params) => api.get('/suppliers', { params }),
    getById: (id) => api.get(`/suppliers/${id}`),
    create: (data) => api.post('/suppliers', data),
    update: (id, data) => api.put(`/suppliers/${id}`, data),
    delete: (id) => api.delete(`/suppliers/${id}`),
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getLowStock: () => api.get('/dashboard/low-stock'),
    getRecentActivity: () => api.get('/dashboard/activity'),
};
```

---

## 🔄 **PHASE 3: UPDATE COMPONENTS**

### **Example 1: Update Dashboard**

**File**: `src/pages/dashboard/Dashboard.jsx`

**Before** (Mock Data):
```javascript
const stats = [
    { title: "Total Sales", value: "PKR 128,450", ... },
    // ... mock data
];
```

**After** (API Integration):
```javascript
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/endpoints';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ErrorState } from '../../components/EmptyState';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all dashboard data
            const [statsRes, lowStockRes, activityRes] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getLowStock(),
                dashboardAPI.getRecentActivity(),
            ]);

            setStats(statsRes.data);
            setLowStockItems(lowStockRes.data);
            setRecentActivity(activityRes.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner size="large" text="Loading dashboard..." />;
    }

    if (error) {
        return <ErrorState onRetry={fetchDashboardData} />;
    }

    return (
        // ... rest of component
    );
}
```

---

### **Example 2: Update Products Page**

**File**: `src/pages/products/Products.jsx`

```javascript
import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/endpoints';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getAll();
            setProducts(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Add product
    const handleAddProduct = async (productData) => {
        try {
            await productsAPI.create(productData);
            fetchProducts(); // Refresh list
            // Show success message
        } catch (err) {
            // Show error message
            console.error('Error adding product:', err);
        }
    };

    // Update product
    const handleUpdateProduct = async (id, productData) => {
        try {
            await productsAPI.update(id, productData);
            fetchProducts(); // Refresh list
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    // Delete product
    const handleDeleteProduct = async (id) => {
        try {
            await productsAPI.delete(id);
            fetchProducts(); // Refresh list
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    // ... rest of component
}
```

---

### **Example 3: Update Login**

**File**: `src/pages/auth/LoginWeb.jsx`

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/endpoints';

export default function LoginWeb() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            setError('');

            // Call login API
            const response = await authAPI.login(credentials);
            
            // Store token
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('userRole', response.data.role);
            localStorage.setItem('userName', response.data.name);

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    // ... rest of component
}
```

---

## 📋 **PHASE 4: BACKEND API REQUIREMENTS**

### **Expected Backend Endpoints**

Your backend developer should create these endpoints:

#### **1. Authentication**
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/verify
```

#### **2. Products**
```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/products/search?q=query
```

#### **3. Inventory**
```
GET    /api/inventory
GET    /api/inventory/:id
POST   /api/inventory/stock-in
POST   /api/inventory/stock-out
GET    /api/inventory/batches/:productId
GET    /api/inventory/low-stock
GET    /api/inventory/expiring
```

#### **4. Purchases**
```
GET    /api/purchases
GET    /api/purchases/:id
POST   /api/purchases
PUT    /api/purchases/:id
DELETE /api/purchases/:id
```

#### **5. GRN**
```
GET    /api/grn
GET    /api/grn/:id
POST   /api/grn
POST   /api/grn/:id/approve
POST   /api/grn/:id/reject
```

#### **6. Sales**
```
GET    /api/sales
GET    /api/sales/:id
POST   /api/sales
GET    /api/sales/:id/receipt
```

#### **7. Reports**
```
GET    /api/reports/sales?startDate=&endDate=
GET    /api/reports/inventory?startDate=&endDate=
GET    /api/reports/purchase?startDate=&endDate=
GET    /api/reports/financial?startDate=&endDate=
GET    /api/reports/:type/export/:format
```

#### **8. Dashboard**
```
GET    /api/dashboard/stats
GET    /api/dashboard/low-stock
GET    /api/dashboard/activity
```

---

## 📊 **EXPECTED DATA FORMATS**

### **Login Response**
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@eazyrx.com",
        "role": "Admin"
    }
}
```

### **Products Response**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Paracetamol 500mg",
            "genericName": "Acetaminophen",
            "category": "Analgesics",
            "sku": "MED-001",
            "barcode": "1234567890123",
            "manufacturer": "PharmaCo",
            "supplier": "MediSupply",
            "costPrice": 5.00,
            "sellingPrice": 10.00,
            "currentStock": 500,
            "minStock": 100,
            "maxStock": 1000,
            "batchNumber": "B2024-001",
            "expiryDate": "2026-12-31",
            "status": "active"
        }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
}
```

### **Dashboard Stats Response**
```json
{
    "success": true,
    "data": {
        "totalSales": 128450,
        "todayOrders": 37,
        "lowStockItems": 12,
        "activeBranch": "Johar Town"
    }
}
```

---

## 🔒 **PHASE 5: AUTHENTICATION FLOW**

### **1. Login Process**
```
User enters credentials
    ↓
Frontend calls /api/auth/login
    ↓
Backend validates credentials
    ↓
Backend returns JWT token
    ↓
Frontend stores token in localStorage
    ↓
Frontend redirects to dashboard
```

### **2. Protected Routes**
```
User navigates to protected page
    ↓
Frontend checks for token
    ↓
If no token → redirect to login
    ↓
If token exists → attach to API requests
    ↓
Backend validates token
    ↓
If valid → return data
If invalid → return 401
    ↓
Frontend handles 401 → redirect to login
```

---

## 🚀 **PHASE 6: TESTING**

### **1. Test API Connection**

Create test file: `src/services/test.js`

```javascript
import { dashboardAPI } from './endpoints';

export const testConnection = async () => {
    try {
        const response = await dashboardAPI.getStats();
        console.log('✅ API Connection Successful:', response.data);
        return true;
    } catch (error) {
        console.error('❌ API Connection Failed:', error);
        return false;
    }
};
```

### **2. Run Test**
```javascript
// In your component or console
import { testConnection } from './services/test';
testConnection();
```

---

## 📝 **INTEGRATION CHECKLIST**

### **Frontend Tasks**:
- [ ] Install axios
- [ ] Create .env file
- [ ] Create api.js service
- [ ] Create endpoints.js
- [ ] Update Dashboard component
- [ ] Update Products component
- [ ] Update Inventory component
- [ ] Update Login component
- [ ] Update all other components
- [ ] Test API calls
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Add success messages

### **Backend Tasks** (For your friend):
- [ ] Create all API endpoints
- [ ] Implement authentication (JWT)
- [ ] Add CORS configuration
- [ ] Create database models
- [ ] Implement CRUD operations
- [ ] Add validation
- [ ] Add error handling
- [ ] Test all endpoints
- [ ] Document API

---

## 🔧 **CORS CONFIGURATION**

Your backend developer needs to enable CORS:

**Express.js Example**:
```javascript
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
}));
```

---

## 📞 **COMMUNICATION WITH BACKEND DEVELOPER**

### **Share This Information**:

1. **API Endpoints List** (from Phase 4)
2. **Expected Data Formats** (from Phase 5)
3. **Authentication Requirements** (JWT)
4. **CORS Configuration** needed

### **Request From Backend**:

1. **API Base URL** (e.g., http://localhost:5000/api)
2. **Authentication method** (JWT, Session, etc.)
3. **API Documentation** (Postman collection or Swagger)
4. **Error response format**
5. **Pagination format**

---

## 🎯 **QUICK START GUIDE**

### **For Immediate Integration**:

1. **Install Dependencies**:
```bash
npm install axios
```

2. **Create .env**:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. **Create API Service**:
- Copy `api.js` code above
- Copy `endpoints.js` code above

4. **Update One Component** (Start with Dashboard):
- Replace mock data with API calls
- Add loading states
- Add error handling

5. **Test**:
```bash
npm run dev
```

---

## 💡 **TIPS**

1. **Start Small**: Integrate one module at a time
2. **Test Often**: Test each API call immediately
3. **Handle Errors**: Always add error handling
4. **Loading States**: Show loading spinners
5. **Console Logs**: Use console.log for debugging
6. **Postman**: Test backend APIs in Postman first

---

**Good Luck with Integration!** 🚀

---

**Created**: January 30, 2026  
**For**: EazyRX Backend Integration
