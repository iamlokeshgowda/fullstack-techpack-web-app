import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import { ROUTES } from "../utils/constants";
import LoginModal from "../components/LoginModal";
import toast from "react-hot-toast";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showLogin, setShowLogin] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    navigate(ROUTES.CHECKOUT);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    navigate(ROUTES.CHECKOUT);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart is Empty</h1>
        <p className="text-gray-600">Add some products to get started!</p>
        <Link
          to={ROUTES.HOME}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <Link
          to={ROUTES.HOME}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Continue Shopping
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-6 flex gap-4 items-start border"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={
                      Array.isArray(item.images) && item.images.length
                        ? item.images[0]
                        : "https://via.placeholder.com/100"
                    }
                    alt={item.productName}
                    className="w-24 h-24 object-cover rounded bg-gray-100"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.productName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.productSlug}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    ${Number(item.productPrice).toFixed(2)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 border rounded px-3 py-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className="font-bold text-gray-600 hover:text-gray-900"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className="font-bold text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>

                {/* Total & Remove */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    ${(item.productPrice * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 border h-fit sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition mb-2"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => {
                dispatch(clearCart());
                toast.success("Cart cleared");
              }}
              className="w-full bg-red-100 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal for Proceed to Checkout when unauthenticated */}
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
