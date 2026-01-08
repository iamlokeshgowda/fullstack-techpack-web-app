import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/axios";

export default function VerifyEmail() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid or missing verification token.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/auth/verify-email/${token}`);

        setStatus("success");
        setMessage(res.data.message || "Email verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error?.response?.data?.message ||
            "Email verification failed. Token may be expired."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft text-center">
        {loading && (
          <>
            <h2 className="text-xl font-semibold text-slate-800">
              Verifying your email...
            </h2>
            <p className="mt-2 text-slate-500">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {!loading && status === "success" && (
          <>
            <h2 className="text-xl font-semibold text-emerald-600">
              ✅ Email Verified
            </h2>
            <p className="mt-2 text-slate-600">{message}</p>

            <Link
              to="/login"
              className="mt-5 inline-block rounded-xl bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700 transition"
            >
              Go to Login
            </Link>
          </>
        )}

        {!loading && status === "error" && (
          <>
            <h2 className="text-xl font-semibold text-red-600">
              ❌ Verification Failed
            </h2>
            <p className="mt-2 text-slate-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
