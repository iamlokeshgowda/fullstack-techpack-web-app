import { useState } from "react";
import { useDispatch } from "react-redux";
import { authStart, authSuccess, authFailure } from "../store/slices/authSlice";
import { setCartFromServer } from "../store/slices/cartSlice";
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
      // fetch server cart and set local cart
      try {
        const cartRes = await api.get(SERVER_ROUTES.USER_CART);
        const serverItems = cartRes.data?.data || [];

        // merge local cart into server: post local-only items then refresh
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        const serverMap = new Set(serverItems.map((it) => it.productId));

        for (const localItem of localCart) {
          if (!serverMap.has(localItem.id)) {
            try {
              await api.post(SERVER_ROUTES.USER_CART, {
                productId: localItem.id,
                quantity: localItem.quantity,
              });
            } catch (e) {
              console.error("Failed to push local cart item to server", e);
            }
          }
        }

        // fetch merged server cart and set local store
        const refreshed = await api.get(SERVER_ROUTES.USER_CART);
        if (refreshed.data?.data)
          dispatch(setCartFromServer(refreshed.data.data));
      } catch (err) {
        console.error("Failed to sync cart after login", err);
      }
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
