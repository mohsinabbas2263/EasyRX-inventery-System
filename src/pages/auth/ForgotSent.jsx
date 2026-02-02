import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

export default function ForgotSent() {
  return (
    <AuthLayout
      title="Check Your Email"
      subtitle="If the email exists, you'll receive a reset link."
      rightTop={
        <Link className="text-sm font-semibold text-teal-700 hover:underline" to="/login/web">
          ← Return
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Reset link requested successfully (demo).
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/forgot-reset"
            className="flex-1 rounded-2xl bg-teal-700 px-5 py-3 text-center font-semibold text-white shadow hover:bg-teal-800"
          >
            Open Reset Page (Demo)
          </Link>

          <Link
            to="/forgot-password"
            className="flex-1 rounded-2xl bg-slate-100 px-5 py-3 text-center font-semibold text-slate-700 hover:bg-slate-200"
          >
            Use Another Email
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
