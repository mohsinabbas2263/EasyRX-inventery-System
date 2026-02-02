import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function PosLogin() {
  const nav = useNavigate();
  const { signInPos } = useAuth();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState("");
  const [pinOrPass, setPinOrPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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

  const onSubmit = async () => {
    setErr("");
    setLoading(true);
    try {
      await signInPos({ username: user, pinOrPassword: pinOrPass });
      nav("/dashboard");
    } catch (e) {
      setErr(e?.normalizedMessage || e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="POS / Local Node Login"
      subtitle="Cashier & Pharmacist (Offline-capable)"
      rightTop={
        <div className="flex items-center gap-3">
          {!isOnline && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase border border-red-100 animate-pulse">
                Offline
              </span>
              <span className="text-[9px] text-slate-400 max-w-[200px]">
                (UI indicator only)
              </span>
            </div>
          )}
          <Link className="text-xs font-bold text-teal-700" to="/login/web">Go Web Login</Link>
        </div>
      }
    >
      <div className="space-y-4">
        {err ? (
          <div className="p-3 rounded-2xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold">
            {err}
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
          <input
            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="e.g. cashier01"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password or PIN</label>
          <input
            type="password"
            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
            value={pinOrPass}
            onChange={(e) => setPinOrPass(e.target.value)}
            placeholder="••••"
          />
        </div>

        <button
          disabled={!canLogin || loading}
          onClick={onSubmit}
          className="w-full h-14 rounded-xl font-bold transition-all duration-200 bg-teal-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-700 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <div className="flex gap-3">
          <button className="flex-1 h-14 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200" onClick={() => alert("UI only")}>
            Switch User
          </button>
          <button className="flex-1 h-14 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200" onClick={() => alert("UI only")}>
            Exit POS
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] text-slate-400">
            Switch login type: <Link className="font-bold text-teal-700" to="/login/web">Cloud Web</Link>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
            <p className="text-[10px] text-amber-700 font-semibold">
              📌 Offline mode: UI indicator only (Day 1–3 scope)
            </p>
            <p className="text-[10px] text-amber-600 mt-1 leading-relaxed">
              Local login will be enabled after local-node integration.
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
