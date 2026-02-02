import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";

export default function ForgotSuccess() {
  return (
    <AuthLayout
      title="Password Updated"
      subtitle="You can now login with your new password."
      rightTop={
        <Link className="text-sm font-semibold text-teal-700 hover:underline" to="/login/web">
          ← Return
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Password updated successfully (demo).
        </div>

        <Link
          to="/login/web"
          className="block w-full rounded-2xl bg-teal-700 px-5 py-3 text-center font-semibold text-white shadow hover:bg-teal-800"
        >
          Go to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
