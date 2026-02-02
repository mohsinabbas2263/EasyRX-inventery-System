import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const canSubmit = email.trim().length >= 6 && email.includes("@");

  return (
    <AuthLayout
      title="Recovery"
      subtitle="We'll send a link to reset your password."
      rightTop={
        <Link className="text-sm font-semibold text-teal-700 hover:underline" to="/login/web">
          ← Return
        </Link>
      }
    >
      <div className="space-y-3">
        <label className="block text-xs font-semibold tracking-wide text-slate-500">
          REGISTERED EMAIL
        </label>

        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-400"
          placeholder="e.g. user@company.pk"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            disabled={!canSubmit}
            className="flex-1 rounded-2xl bg-teal-700 px-5 py-3 font-semibold text-white shadow hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => navigate("/forgot-sent")}
          >
            Request Link
          </button>

          <button
            className="flex-1 rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"
            onClick={() => navigate("/forgot-reset?state=expired")}
          >
            Simulate Expired
          </button>
        </div>

        <p className="pt-2 text-xs text-slate-500">
          Note: UI only (backend later).
        </p>
      </div>
    </AuthLayout>
  );
}
