import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Activity,
  Building2,
  FileText,
} from "lucide-react";
import { THEME } from "../../../theme";
import { PERMISSIONS } from "../../../utils/permissions";
import { usePermissions } from "../../../hooks/usePermissions";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, permission: PERMISSIONS.DASHBOARD_VIEW },
  { label: "Products", to: "/products", icon: Pill, permission: PERMISSIONS.PRODUCTS_VIEW },
  { label: "Inventory", to: "/inventory", icon: Package, permission: PERMISSIONS.INVENTORY_VIEW },
  { label: "Suppliers", to: "/suppliers", icon: Building2, permission: PERMISSIONS.SUPPLIERS_VIEW },
  { label: "GRN", to: "/grn", icon: FileText, permission: PERMISSIONS.GRN_VIEW },
  { label: "POS", to: "/pos", icon: ShoppingCart, permission: PERMISSIONS.POS_ACCESS },
  { label: "Reports", to: "/reports", icon: BarChart3, permission: PERMISSIONS.REPORTS_VIEW },
  { label: "Settings", to: "/settings", icon: Settings, permission: PERMISSIONS.SETTINGS_VIEW },
];


export default function Sidebar({ role = 'Admin' }) {
  // Use permissions hook
  const { has: hasPermission } = usePermissions(role);

  // Filter nav items based on permissions
  const accessibleNavItems = navItems.filter(item =>
    !item.permission || hasPermission(item.permission)
  );

  return (
    <aside className="h-full w-64 border-r border-slate-200 bg-white flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="px-5 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg shadow-primary-500/25">
            <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">EazyRX</h1>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Inventory Pro</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <div className="flex flex-col gap-1">
          {accessibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "group relative rounded-lg px-3 py-2.5 text-sm transition-all duration-200 font-medium flex items-center gap-3",
                    isActive
                      ? "bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary-600"></div>
                    )}
                    <Icon
                      className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} group-hover:scale-110`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-600"></div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer Status */}
      <div className="px-3 pb-4">
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3.5 shadow-sm">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
              <Activity className="h-4 w-4 text-primary-600" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-700">System Status</p>
              <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">
                All systems operational
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-medium text-emerald-600">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
