import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, AlertTriangle, Clock, TrendingUp, Package } from "lucide-react";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StatsCard";
import { THEME } from "../../theme";
import { usePermissions } from "../../hooks/usePermissions";
import { PERMISSIONS } from "../../utils/permissions";

export default function Dashboard() {
  const navigate = useNavigate();
  const [demoRole, setDemoRole] = useState("Admin");
  const permissions = usePermissions(demoRole);

  const roleBadge = useMemo(() => {
    if (demoRole === "Admin")
      return { label: "Admin • Full Access", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (demoRole === "Pharmacist")
      return { label: "Pharmacist • Limited Access", cls: "bg-blue-50 text-blue-700 border-blue-200" };
    return { label: "Cashier • Limited Access", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  }, [demoRole]);

  const stats = [
    { title: "Total Sales", value: "PKR 128,450", subtext: "Last 30 days", icon: "💰", trend: 12.5 },
    { title: "Today's Orders", value: "37", subtext: "Active", icon: "📦", trend: 8.2 },
    { title: "Low Stock Items", value: "12", subtext: "Requires attention", icon: "⚠️", trend: -5.3 },
    { title: "Active Branch", value: "Johar Town", subtext: "Operational", icon: "🏬" },
  ];

  const lowStockItems = [
    { name: "Paracetamol 500mg", qty: 7, batch: "B2401", expiry: "Mar 2026", status: "critical" },
    { name: "Omeprazole 20mg", qty: 4, batch: "B2398", expiry: "Feb 2026", status: "critical" },
    { name: "Cetirizine 10mg", qty: 6, batch: "B2405", expiry: "Apr 2026", status: "warning" },
    { name: "ORS Sachet", qty: 3, batch: "B2392", expiry: "Jan 2026", status: "critical" },
  ];

  const recentActivity = [
    { action: "POS Sale", detail: "Invoice #INV-10231 created", time: "2 min ago", type: "sale" },
    { action: "Stock Adjustment", detail: "Batch expiry correction", time: "15 min ago", type: "adjustment" },
    { action: "Purchase GRN", detail: "GRN-554 posted successfully", time: "1 hour ago", type: "purchase" },
    { action: "Branch Transfer", detail: "Transfer to Model Town initiated", time: "2 hours ago", type: "transfer" },
  ];

  const handleLogout = () => navigate("/login/web");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar role={demoRole} />

        <main className="flex-1">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">Welcome back, here's your overview</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Role Selector */}
                <div className="relative">
                  <select
                    value={demoRole}
                    onChange={(e) => setDemoRole(e.target.value)}
                    className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer transition-colors"
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
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {stats.map((s) => (
                <StatsCard
                  key={s.title}
                  title={s.title}
                  value={s.value}
                  subtext={s.subtext}
                  icon={s.icon}
                  trend={s.trend}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Low Stock - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                        <AlertTriangle className="h-5 w-5 text-amber-600" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-slate-900">Low Stock Alert</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Items requiring immediate attention</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/inventory")}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      View All →
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Batch</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Expiry</th>
                          <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {lowStockItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-900">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-sm text-slate-600">{item.batch}</td>
                            <td className="px-5 py-3 text-sm text-slate-600">{item.expiry}</td>
                            <td className="px-5 py-3 text-right">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'critical'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                                }`}>
                                {item.qty}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-1">
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <Clock className="h-5 w-5 text-blue-600" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-slate-900">Activity</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Recent updates</p>
                      </div>
                    </div>
                  </div>

                  {/* Activity List */}
                  <div className="p-4 space-y-3">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex-shrink-0">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${activity.type === 'sale' ? 'bg-emerald-100' :
                            activity.type === 'purchase' ? 'bg-blue-100' :
                              activity.type === 'adjustment' ? 'bg-amber-100' :
                                'bg-purple-100'
                            }`}>
                            <div className={`h-2 w-2 rounded-full ${activity.type === 'sale' ? 'bg-emerald-600' :
                              activity.type === 'purchase' ? 'bg-blue-600' :
                                activity.type === 'adjustment' ? 'bg-amber-600' :
                                  'bg-purple-600'
                              }`}></div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{activity.detail}</p>
                          <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
