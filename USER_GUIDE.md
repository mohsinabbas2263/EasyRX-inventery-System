# 📖 EAZYRX - USER GUIDE

## 🎯 Welcome to EazyRX!

This guide will help you understand and use all features of the EazyRX Pharmacy Management System.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Login](#login)
3. [Dashboard](#dashboard)
4. [Products Management](#products-management)
5. [Inventory Management](#inventory-management)
6. [Purchase Management](#purchase-management)
7. [Point of Sale (POS)](#point-of-sale)
8. [Reports & Analytics](#reports--analytics)
9. [User Roles](#user-roles)
10. [Tips & Tricks](#tips--tricks)

---

## 🚀 Getting Started

### **First Time Setup**

1. **Launch the Application**
   - **Web**: Open browser and go to the application URL
   - **Desktop**: Double-click the EazyRX icon

2. **Login**
   - Enter your username and password
   - Select your role (Admin, Pharmacist, or Cashier)
   - Click "Sign In"

3. **Explore Dashboard**
   - View your personalized dashboard
   - Check alerts and notifications
   - Navigate using the sidebar menu

---

## 🔐 Login

### **Web Login**
1. Open the application in your browser
2. You'll see the login page
3. Enter credentials
4. Click "Sign In to Dashboard"

### **Desktop Login**
1. Launch the desktop app
2. Enter credentials
3. Click "Sign In"

### **Demo Credentials**
```
Admin:
Username: admin
Password: admin123

Pharmacist:
Username: pharmacist
Password: pharma123

Cashier:
Username: cashier
Password: cash123
```

---

## 📊 Dashboard

### **Overview**
The dashboard is your home screen showing:
- **Statistics Cards**: Revenue, orders, stock alerts
- **Low Stock Alerts**: Items running low
- **Recent Activity**: Latest transactions
- **Quick Actions**: Fast access to common tasks

### **Features**

#### **1. Statistics Cards**
- **Total Sales**: Last 30 days revenue
- **Today's Orders**: Active orders count
- **Low Stock Items**: Items needing reorder
- **Active Branch**: Current location

#### **2. Low Stock Alerts**
- View items with low inventory
- See batch numbers and expiry dates
- Color-coded by urgency:
  - 🔴 **Critical**: Immediate action needed
  - 🟡 **Warning**: Reorder soon

#### **3. Recent Activity**
- POS sales
- Stock adjustments
- Purchase GRNs
- Branch transfers

---

## 💊 Products Management

### **Viewing Products**
1. Click "Products" in sidebar
2. Browse product list
3. Use search to find specific items
4. Filter by category

### **Adding a Product**
1. Click "Add Product" button
2. Fill in details:
   - Product name
   - Category
   - Price
   - Batch number
   - Expiry date
3. Click "Save"

### **Editing a Product**
1. Find the product
2. Click "Edit" button
3. Update information
4. Click "Save Changes"

### **Deleting a Product** (Admin only)
1. Find the product
2. Click "Delete" button
3. Confirm deletion

---

## 📦 Inventory Management

### **Stock In**
1. Go to "Inventory" page
2. Click "Stock In"
3. Select product
4. Enter quantity
5. Add batch details
6. Click "Submit"

### **Stock Out**
1. Go to "Inventory" page
2. Click "Stock Out"
3. Select product
4. Enter quantity
5. Add reason
6. Click "Submit"

### **Viewing Stock Levels**
- See current stock for all products
- Filter by category
- Check expiry dates
- View batch information

### **Stock Alerts**
- **Low Stock**: Items below minimum level
- **Expiring Soon**: Items expiring in 30 days
- **Out of Stock**: Zero quantity items

---

## 🛒 Purchase Management

### **Creating Purchase Order**
1. Go to "Purchases" page
2. Click "New Purchase"
3. Select supplier
4. Add products and quantities
5. Review total
6. Click "Create Order"

### **GRN (Goods Receipt Note)**
1. Go to "GRN" page
2. Click "New GRN"
3. Select purchase order
4. Verify received items
5. Enter batch details
6. Click "Post GRN"

### **Approving GRN** (Admin only)
1. View pending GRNs
2. Review details
3. Click "Approve" or "Reject"

---

## 💰 Point of Sale (POS)

### **Making a Sale**
1. Go to "POS" page
2. Scan barcode or search product
3. Add items to cart
4. Enter quantities
5. Select payment method
6. Click "Complete Sale"

### **Payment Methods**
- Cash
- Card
- Digital Wallet

### **Printing Receipt**
1. After sale completion
2. Click "Print Receipt"
3. Receipt will print automatically

### **Applying Discount** (Admin/Pharmacist only)
1. Add items to cart
2. Click "Apply Discount"
3. Enter discount percentage
4. Discount applied to total

---

## 📈 Reports & Analytics

### **Accessing Reports**
1. Click "Reports" in sidebar
2. Select report type
3. Choose date range
4. Apply filters
5. View results

### **Report Types**

#### **1. Sales Report** 💰
- Total revenue
- Transaction count
- Items sold
- Average transaction value
- Sales trends
- Payment methods
- Top products

#### **2. Inventory Report** 📦
- Total products
- Stock value
- Low stock items
- Expiring items
- Stock by category
- Stock movement

#### **3. Purchase Report** 🛒 (Admin/Pharmacist only)
- Total purchases
- Completed GRNs
- Pending GRNs
- Supplier analysis
- Monthly trends
- Payment status

#### **4. Financial Report** 💵 (Admin only)
- Total revenue
- Gross profit
- Net profit
- Tax summary
- P&L statement
- Expense breakdown
- Monthly profit trends
- Cash flow

### **Date Filters**

#### **Quick Presets**:
- Today
- Yesterday
- This Week
- Last Week
- This Month
- Last Month
- This Quarter
- This Year

#### **Custom Range**:
1. Click "Custom Range"
2. Select start date
3. Select end date
4. Click "Apply"

### **Exporting Reports**
1. Generate report
2. Click "Export Report"
3. Select format:
   - **CSV**: For Excel/Sheets
   - **Excel**: Native Excel format
   - **PDF**: For printing

---

## 👥 User Roles

### **👑 Admin**
**Full Access to Everything**

**Can Do**:
- ✅ Manage all products
- ✅ Complete inventory control
- ✅ Approve/reject GRNs
- ✅ View all reports
- ✅ Access settings
- ✅ Manage users
- ✅ Apply discounts

**Cannot Do**:
- Nothing - full access!

---

### **💊 Pharmacist**
**Limited Access**

**Can Do**:
- ✅ View dashboard
- ✅ Add/edit products (no delete)
- ✅ Manage inventory
- ✅ View suppliers
- ✅ Create GRNs (no approve)
- ✅ Process sales
- ✅ Apply discounts
- ✅ View sales & inventory reports

**Cannot Do**:
- ❌ Delete products
- ❌ Approve/reject GRNs
- ❌ View financial reports
- ❌ Access settings

---

### **💵 Cashier**
**Minimal Access**

**Can Do**:
- ✅ View limited dashboard
- ✅ Process sales (POS only)

**Cannot Do**:
- ❌ Manage products
- ❌ Manage inventory
- ❌ View suppliers
- ❌ Create GRNs
- ❌ Apply discounts
- ❌ View reports
- ❌ Access settings

---

## 💡 Tips & Tricks

### **Keyboard Shortcuts**
- **Ctrl + K**: Quick search
- **Ctrl + N**: New item (context-dependent)
- **Ctrl + S**: Save
- **Esc**: Close modal/cancel

### **Navigation**
- Use sidebar for main navigation
- Click logo to return to dashboard
- Use breadcrumbs for sub-pages

### **Search**
- Use search box in each module
- Search by name, code, or batch
- Results update in real-time

### **Filters**
- Combine multiple filters
- Clear filters to see all data
- Save common filter combinations

### **Best Practices**

#### **For Inventory**:
1. Update stock regularly
2. Check expiry dates weekly
3. Respond to low stock alerts
4. Verify batch numbers

#### **For Sales**:
1. Double-check quantities
2. Verify customer details
3. Print receipts
4. Process returns promptly

#### **For Reports**:
1. Generate reports regularly
2. Export for record-keeping
3. Analyze trends monthly
4. Share with management

---

## ❓ Frequently Asked Questions

### **Q: How do I change my password?**
A: Go to Settings > Profile > Change Password

### **Q: Can I access the system from mobile?**
A: Yes, the web version is mobile-responsive

### **Q: How do I print reports?**
A: Export to PDF and print from your PDF viewer

### **Q: What if I make a mistake?**
A: Most actions can be edited or reversed. Contact admin if needed.

### **Q: How do I get more permissions?**
A: Contact your administrator to change your role

### **Q: Can I customize the dashboard?**
A: Dashboard layout is fixed but shows role-specific content

---

## 🆘 Getting Help

### **In-App Help**:
- Look for ℹ️ icons for tooltips
- Hover over buttons for descriptions
- Check empty states for guidance

### **Support**:
- **Email**: support@eazyrx.com
- **Phone**: Contact your admin
- **Documentation**: This guide!

---

## 🎯 Quick Reference

### **Common Tasks**

| Task | Steps |
|------|-------|
| Add Product | Products → Add Product → Fill form → Save |
| Stock In | Inventory → Stock In → Select product → Submit |
| Make Sale | POS → Add items → Complete Sale |
| View Report | Reports → Select type → Choose dates → View |
| Export Data | Generate report → Export → Select format |

---

## 🎊 Congratulations!

You're now ready to use EazyRX effectively!

**Remember**:
- Explore features gradually
- Use search and filters
- Check reports regularly
- Keep stock updated
- Ask for help when needed

---

**Happy Managing!** 🏥💊

---

**Version**: 1.0.0  
**Last Updated**: January 30, 2026  
**For**: EazyRX Users
