import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/products/Products";
import Inventory from "../pages/inventory/Inventory";
import Suppliers from "../pages/suppliers/Suppliers";
import GRN from "../pages/grn/GRN";
import POS from "../pages/pos/POS";
import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";

// ✅ IMPORTANT: These must exist in your project:
// src/pages/auth/WebLogin.jsx
// src/pages/auth/PosLogin.jsx
import WebLogin from "../pages/auth/WebLogin";
import PosLogin from "../pages/auth/PosLogin";

// OPTIONAL: If you have forgot/reset pages, add them here (only if they exist)
// import ForgotEnter from "../pages/auth/ForgotEnter";
// import LinkSent from "../pages/auth/LinkSent";
// import ResetPassword from "../pages/auth/ResetPassword";
// import ResetSuccess from "../pages/auth/ResetSuccess";

function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">
          Coming soon in future updates.
        </p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Auth routes */}
      <Route path="/login/web" element={<WebLogin />} />
      <Route path="/login/pos" element={<PosLogin />} />

      {/* ✅ Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* ✅ Day 4: Products & Inventory Management */}
      <Route path="/products" element={<Products />} />
      <Route path="/inventory" element={<Inventory />} />

      {/* ✅ Task 6: Purchases UI - Suppliers & GRN */}
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/grn" element={<GRN />} />

      {/* ✅ Day 5: POS (Point of Sale) */}
      <Route path="/pos" element={<POS />} />

      {/* ✅ Day 6: Reports & Analytics */}
      <Route path="/reports" element={<Reports />} />

      {/* ✅ Day 7: Settings & Configuration */}
      <Route path="/settings" element={<Settings />} />

      {/* ✅ Default */}
      <Route path="/" element={<Navigate to="/login/web" replace />} />
      <Route path="*" element={<Navigate to="/login/web" replace />} />
    </Routes>
  );
}
