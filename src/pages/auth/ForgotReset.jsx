import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

export default function ForgotReset() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const state = useMemo(() => {
    const sp = new URLSearchParams(search);
    return sp.get("state") || "ok";
  }, [search]);

  const isExpired = state === "expired";

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const minLenOk = newPass.length >= 8;
  const matchOk = newPass === confirmPass && confirmPass.length > 0;

  const canSubmit = minLenOk && matchOk && !isExpired;

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Set a new password for your account."
      rightTop={
        <Link className="text-sm font-semibold text-teal-700 hover:underline" to="/login/web">
          ← Return
        </Link>
      }
    >
      <div className="space-y-4">
        {isExpired && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            This reset link is expired (demo). Please request a new link.
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            New Password
          </label>
          <input
            type="password"
            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Minimum 8 characters"
          />
          {!minLenOk && newPass.length > 0 && (
            <p className="text-xs text-red-600">Minimum 8 characters required.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Re-enter password"
          />
          {confirmPass.length > 0 && !matchOk && (
            <p className="text-xs text-red-600">Passwords do not match.</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            disabled={!canSubmit}
            className="flex-1 rounded-2xl bg-teal-700 px-5 py-3 font-semibold text-white shadow hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => navigate("/forgot-success")}
          >
            Update Password
          </button>

          <Link
            to="/forgot-password"
            className="flex-1 rounded-2xl bg-slate-100 px-5 py-3 text-center font-semibold text-slate-700 hover:bg-slate-200"
          >
            Request New Link
          </Link>
        </div>

        <div className="text-xs text-slate-500">
          Demo tip: expired screen ke liye open karein{" "}
          <Link className="font-bold text-teal-700 hover:underline" to="/forgot-reset?state=expired">
            /forgot-reset?state=expired
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
