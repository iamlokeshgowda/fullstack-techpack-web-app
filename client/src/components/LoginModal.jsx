import { useState } from "react";
import { useDispatch } from "react-redux";
import { authStart, authSuccess, authFailure } from "../store/slices/authSlice";
import api from "../services/axios";
import { SERVER_ROUTES } from "../utils/constants";
import toast from "react-hot-toast";

export default function LoginModal({ open, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email and password required");

    try {
      setLoading(true);
      dispatch(authStart());
      const res = await api.post(SERVER_ROUTES.AUTH_LOGIN, { email, password });
      dispatch(authSuccess(res.data));
      toast.success("Login successful");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      dispatch(authFailure(err.response?.data?.message || "Login failed"));
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Login</h3>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
