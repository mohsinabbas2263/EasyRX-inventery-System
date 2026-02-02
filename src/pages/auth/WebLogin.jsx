import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function WebLogin() {
  const nav = useNavigate();
  const { signInWeb } = useAuth();

  const [companyCode, setCompanyCode] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canLogin = companyCode.trim().length > 1 && user.trim().length > 2 && pass.length >= 8;

  const onSubmit = async () => {
    setErr("");
    setLoading(true);
    try {
      await signInWeb({ companyCode, username: user, password: pass });
      nav("/dashboard");
    } catch (e) {
      setErr(e?.normalizedMessage || e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
        {err ? (
          <div className="p-3 rounded-2xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold">
            {err}
          </div>
        ) : null}

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
          <p className="text-[11px] text-slate-400">
            Demo password: <span className="font-bold">Password123</span>
          </p>
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

        <div className="flex justify-between text-xs">
          <Link className="font-bold text-teal-700 hover:underline" to="/forgot-password">Forgot Password</Link>
          <button className="font-bold text-slate-500 hover:underline" onClick={() => alert("Support (UI only)")}>
            Help / Support
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          Switch login type: <Link className="font-bold text-teal-700" to="/login/pos">POS / Local Node</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
