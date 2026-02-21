import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

export default function PosLogin() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState("");
  const [pinOrPass, setPinOrPass] = useState("");

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const canLogin = user.trim().length > 2 && pinOrPass.length >= 4;

  return (
    <AuthLayout
      title="POS / Local Node Login"
      subtitle="Cashier & Pharmacist (Offline-capable)"
      rightTop={
        <div className="flex items-center gap-3">
          {!isOnline && (
            <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase border border-red-100 animate-pulse">
              Offline
            </span>
          )}
          <Link className="text-xs font-bold text-teal-700" to="/login/web">Go Web Login</Link>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Username
          </label>
          <input
            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="e.g. cashier01"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Password or PIN
          </label>
          <input
            type="password"
            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            value={pinOrPass}
            onChange={(e) => setPinOrPass(e.target.value)}
            placeholder="••••"
          />
        </div>

        <button
          disabled={!canLogin}
          className="w-full h-14 rounded-xl font-bold transition-all duration-200 bg-teal-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-700"
        >
          Login
        </button>

        <div className="flex gap-3">
          <button className="flex-1 h-14 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">
            Switch User
          </button>
          <button className="flex-1 h-14 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">
            Exit POS
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          Switch login type: <Link className="font-bold text-teal-700" to="/login/web">Cloud Web</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
