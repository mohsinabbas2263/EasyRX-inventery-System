# 🏥 EazyRX - Pharmacy Management System

## 📋 Overview

**EazyRX** is a comprehensive pharmacy management system built with modern web technologies. It provides a complete solution for managing pharmacy operations including inventory, sales, purchases, and reporting.

---

## ✨ Features

### 🔐 **Authentication**
- Web & Desktop login interfaces
- Role-based access (Admin, Pharmacist, Cashier)
- Secure session management

### 📊 **Dashboard**
- Real-time statistics and metrics
- Low stock alerts
- Recent activity tracking
- Quick action buttons

### 💊 **Products Management**
- Add, edit, and manage products
- Category-based organization
- Search and filter capabilities
- Batch and expiry tracking

### 📦 **Inventory Management**
- Stock in/out operations
- Batch management
- Expiry date tracking
- Automated stock alerts

### 🛒 **Purchase Management**
- Create purchase orders
- GRN (Goods Receipt Note) management
- Supplier tracking
- Approval workflow

### 💰 **Point of Sale (POS)**
- Fast sales interface
- Barcode scanning support
- Receipt generation
- Multiple payment methods

### 📈 **Reports & Analytics**
- **Sales Reports**: Revenue, transactions, top products
- **Inventory Reports**: Stock levels, movements, alerts
- **Purchase Reports**: Supplier analysis, GRN tracking
- **Financial Reports**: P&L, expenses, profit trends
- Export to CSV, Excel, and PDF

### 🔒 **Permissions System**
- 3 user roles with distinct permissions
- 24 granular permission controls
- Dynamic UI based on user role
- Secure access control

### 🎨 **UX Components**
- Professional loading states
- Skeleton loaders
- Empty state messages
- Error handling
- Smooth animations

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** >= 16.x
- **npm** >= 8.x

### **Installation**

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd eazyrx-frontend

# Install dependencies
npm install
```

### **Running the Application**

#### **Web Application**
```bash
npm run dev
```
Open browser at `http://localhost:5173`

#### **Desktop Application**
```bash
npm run electron:dev
```

### **Building for Production**

#### **Web Build**
```bash
npm run build
```
Output: `dist/` folder

#### **Desktop Build**
```bash
npm run electron:build
```
Output: `dist-electron/` folder

---

## 🎯 User Roles & Permissions

### **👑 Admin** (Full Access)
- ✅ All features and modules
- ✅ Complete CRUD operations
- ✅ All reports and analytics
- ✅ Settings and configuration
- ✅ User management

### **💊 Pharmacist** (Limited Access)
- ✅ Dashboard (view only)
- ✅ Products (add, edit - no delete)
- ✅ Inventory (manage stock)
- ✅ Suppliers (view only)
- ✅ GRN (create - no approve)
- ✅ POS (full access)
- ✅ Reports (sales & inventory only)
- ❌ Settings (no access)

### **💵 Cashier** (Minimal Access)
- ✅ Dashboard (limited view)
- ✅ POS (sales only)
- ❌ Products (no access)
- ❌ Inventory (no access)
- ❌ Reports (no access)
- ❌ Settings (no access)

---

## 📱 Screenshots

### Login Page
Professional login interface for web and desktop

### Dashboard
Real-time statistics, alerts, and activity feed

### Reports
Comprehensive reporting with export capabilities

### POS
Fast and intuitive point of sale interface

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - UI library
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

### **Desktop**
- **Electron** - Desktop app framework
- **Electron Builder** - Packaging

### **Utilities**
- Custom hooks for permissions
- Export utilities (CSV, Excel, PDF)
- Date formatting
- Mock data for development

---

## 📁 Project Structure

```
eazyrx-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard
│   │   ├── products/       # Products management
│   │   ├── inventory/      # Inventory management
│   │   ├── suppliers/      # Suppliers management
│   │   ├── grn/            # GRN management
│   │   ├── pos/            # Point of Sale
│   │   └── reports/        # Reports & Analytics
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── data/               # Mock data
│   └── theme.js            # Theme configuration
├── electron/               # Electron configuration
├── public/                 # Static assets
└── package.json
```

---

## 🎨 Design System

### **Colors**
- **Primary**: Teal (#0D9488)
- **Secondary**: Slate (#64748B)
- **Success**: Emerald (#10B981)
- **Warning**: Amber (#F59E0B)
- **Danger**: Red (#EF4444)

### **Typography**
- **Font Family**: System fonts (Inter, Segoe UI, Roboto)
- **Sizes**: Responsive scaling

### **Components**
- Consistent border radius (8px, 12px, 16px)
- Smooth transitions (200-300ms)
- Professional shadows
- Responsive design

---

## 📊 Features in Detail

### **Reports Module**
- **4 Report Types**: Sales, Inventory, Purchase, Financial
- **8 Quick Filters**: Today, Yesterday, This Week, Last Week, etc.
- **Custom Date Range**: Select any date range
- **Export Options**: CSV, Excel, PDF
- **Dynamic Filters**: Category, supplier, status, search

### **Permissions System**
- **24 Granular Permissions**: Fine-grained access control
- **Dynamic UI**: Menu items hide/show based on role
- **Permission Guards**: Protect sensitive features
- **Flexible**: Easy to add new permissions

### **UX Components**
- **Loading States**: Spinners, skeletons, overlays
- **Empty States**: Helpful messages with actions
- **Error Handling**: Graceful error boundaries
- **Animations**: Smooth transitions and effects

---

## 🔧 Configuration

### **Theme Customization**
Edit `src/theme.js` to customize colors and styles.

### **Mock Data**
Mock data is located in `src/data/` for development and testing.

### **Permissions**
Modify `src/utils/permissions.js` to adjust role permissions.

---

## 📝 Development

### **Code Style**
- Functional components with hooks
- Tailwind CSS for styling
- Modular component structure
- Clean and documented code

### **Adding New Features**
1. Create component in appropriate folder
2. Add route in `App.jsx`
3. Update sidebar navigation
4. Add permissions if needed
5. Test thoroughly

---

## 🐛 Troubleshooting

### **Common Issues**

**Issue**: App not starting  
**Solution**: Run `npm install` and check Node version

**Issue**: Styles not loading  
**Solution**: Clear cache and rebuild

**Issue**: Electron app not opening  
**Solution**: Check Electron installation

---

## 📦 Deployment

### **Web Deployment**
1. Build: `npm run build`
2. Deploy `dist/` folder to web server
3. Configure environment variables

### **Desktop Deployment**
1. Build: `npm run electron:build`
2. Distribute installer from `dist-electron/`
3. Support Windows, macOS, Linux

---

## 🎯 Roadmap

### **Completed** ✅
- Complete UI/UX
- All core features
- Permission system
- Reports module
- Desktop app
- UX components

### **Future Enhancements** 🚀
- Backend API integration
- Real-time data sync
- Mobile app (React Native)
- Advanced analytics
- Multi-branch support
- Cloud backup

---

## 📄 License

This project is proprietary software developed for EazyRX.

---

## 👥 Team

**Developer**: Rabail Butt  
**Project**: EazyRX Pharmacy Management System  
**Date**: January 2026

---

## 📞 Support

For support and queries:
- Email: support@eazyrx.com
- Documentation: See DEVELOPER_GUIDE.md
- Issues: Contact development team

---

## 🙏 Acknowledgments

- React team for amazing framework
- Tailwind CSS for utility-first CSS
- Electron for desktop capabilities
- Lucide for beautiful icons

---

**Built with ❤️ for modern pharmacy management**

---

## 📚 Additional Documentation

- **Developer Guide**: See `DEVELOPER_GUIDE.md`
- **User Manual**: See `USER_GUIDE.md`
- **Project Summary**: See `PROJECT_SUMMARY.md`
- **Task Documentation**: See `TASK_*_COMPLETE.md` files

---

**Version**: 1.0.0  
**Last Updated**: January 30, 2026  
**Status**: Production Ready ✅
