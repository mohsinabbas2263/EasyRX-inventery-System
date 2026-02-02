import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

export default function ForgotEnter() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = useMemo(() => {
    const v = email.trim();
    return v.length > 5 && v.includes("@") && v.includes(".");
  }, [email]);

  const showError = touched && !isValid;

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
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-semibold tracking-wide text-slate-500">
            REGISTERED EMAIL
          </label>
          <input
            className={
              "w-full rounded-2xl border bg-slate-50 px-4 py-3 outline-none focus:border-teal-400 " +
              (showError ? "border-red-300" : "border-slate-200")
            }
            placeholder="e.g. user@company.pk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          {showError && (
            <div className="text-xs text-red-600">
              Please enter a valid email.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            disabled={!isValid}
            className="flex-1 rounded-2xl bg-teal-700 px-5 py-3 font-semibold text-white shadow hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => nav("/forgot/sent")}
          >
            Request Link
          </button>

          <button
            className="flex-1 rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"
            onClick={() => nav("/forgot/reset")}
          >
            Simulate Expired
          </button>
        </div>

        <p className="pt-1 text-xs text-slate-500">
          Note: This is UI only. Backend/API integration will be done later (Day 12+).
        </p>
      </div>
    </AuthLayout>
  );
}
