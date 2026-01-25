import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

export default function WebLogin() {
  const [companyCode, setCompanyCode] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const canLogin = companyCode.trim().length > 1 && user.trim().length > 2 && pass.length >= 8;

  return (
    <AuthLayout
      title="Cloud Web Login"
      subtitle="Admin, Head Office, Managers & Reports"
      rightTop={
        <div className="flex items-center gap-3">
          <Link className="text-xs font-bold text-teal-700" to="/login/pos">Go POS Login</Link>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Company Code / Tenant ID
          </label>
          <input
            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            value={companyCode}
            onChange={(e) => setCompanyCode(e.target.value)}
            placeholder="e.g. EZRX-001"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Username or Email
          </label>
          <input
            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="e.g. admin@eazyrx.pk"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          disabled={!canLogin}
          className="w-full h-14 rounded-xl font-bold transition-all duration-200 bg-teal-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-700"
        >
          Login
        </button>

        <div className="flex justify-between text-xs">
          <button className="font-bold text-teal-700 hover:underline">Forgot Password</button>
          <button className="font-bold text-slate-500 hover:underline">Help / Support</button>
        </div>

        <div className="text-[11px] text-slate-400">
          Switch login type: <Link className="font-bold text-teal-700" to="/login/pos">POS / Local Node</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
