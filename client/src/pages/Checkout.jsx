import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { clearCart } from "../store/slices/cartSlice";
import { ROUTES, SERVER_ROUTES } from "../utils/constants";
import toast from "react-hot-toast";
import { PayPalButtons } from "@paypal/react-paypal-js";
import api from "../services/axios";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const { products } = useSelector((state) => state.public);
  const [loading, setLoading] = useState(false);

  // Merge cart items with product details from Redux store
  const detailedCartaItem = cartItems.map((item) => {
    const product = products.data.find((p) => p.id === item.id);
    return {
      ...item,
      productName: product ? product.productName : "Unknown Product",
      productSlug: product ? product.productSlug : "",
      productPrice: product ? product.productPrice : 0,
      images: product ? product.images : [],
    };
  });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
    country: user?.country || "",
  });

  const subtotal = detailedCartaItem.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const totalAmount = subtotal + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (cartItems.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50'>
        <h1 className='text-2xl font-bold text-gray-900'>No items in cart</h1>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className='mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition'
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4'>
        <Link
          to={ROUTES.CART}
          className='text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-4'
        >
          ← Back to Cart
        </Link>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Checkout</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Checkout Form */}
          <div className='lg:col-span-2 bg-white rounded-lg p-6 border'>
            <form className='space-y-6'>
              {/* Personal Info */}
              <div>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>
                  Personal Information
                </h2>
                <div className='grid grid-cols-2 gap-4'>
                  <input
                    type='text'
                    name='firstName'
                    placeholder='First Name *'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className='border rounded px-4 py-2 w-full'
                    required
                  />
                  <input
                    type='text'
                    name='lastName'
                    placeholder='Last Name *'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className='border rounded px-4 py-2 w-full'
                    required
                  />
                </div>
                <div className='grid grid-cols-2 gap-4 mt-4'>
                  <input
                    type='email'
                    name='email'
                    placeholder='Email *'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='border rounded px-4 py-2 w-full'
                    required
                  />
                  <input
                    type='tel'
                    name='phone'
                    placeholder='Phone *'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='border rounded px-4 py-2 w-full'
                    required
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>
                  Shipping Address
                </h2>
                <input
                  type='text'
                  name='address'
                  placeholder='Address *'
                  value={formData.address}
                  onChange={handleInputChange}
                  className='border rounded px-4 py-2 w-full mb-4'
                  required
                />
                <div className='grid grid-cols-2 gap-4'>
                  <input
                    type='text'
                    name='city'
                    placeholder='City *'
                    value={formData.city}
                    onChange={handleInputChange}
                    className='border rounded px-4 py-2 w-full'
                    required
                  />
                  <input
                    type='text'
                    name='state'
                    placeholder='State / Province'
                    value={formData.state}
                    onChange={handleInputChange}
                    className='border rounded px-4 py-2 w-full'
                  />
                </div>
                <div className='grid grid-cols-2 gap-4 mt-4'>
                  <input
                    type='text'
                    name='zipCode'
                    placeholder='ZIP Code *'
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className='border rounded px-4 py-2 w-full'
                    required
                  />
                  <input
                    type='text'
                    name='country'
                    placeholder='Country'
                    value={formData.country}
                    onChange={handleInputChange}
                    className='border rounded px-4 py-2 w-full'
                  />
                </div>
              </div>

              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={async () => {
                  try {
                    const res = await api.post(SERVER_ROUTES.CREATE_ORDER, {
                      items: cartItems,
                      customerInfo: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                      },

                      shippingAddress: {
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country,
                      },
                      subtotal,
                      tax,
                      totalAmount,
                    });

                    return res.data.id;
                  } catch (err) {
                    console.error(
                      "Create order failed:",
                      err.response?.data || err.message
                    );
                    toast.error("Unable to start PayPal payment");
                    throw err; // VERY IMPORTANT
                  }
                }}
                onApprove={async (data) => {
                  try {
                    const res = await api.post(SERVER_ROUTES.CAPTURE_ORDER, {
                      orderID: data.orderID,
                    });
                    toast.success("Payment successful 🎉");
                    dispatch(clearCart());
                    navigate(ROUTES.MY_ORDERS);
                  } catch (err) {
                    console.error(
                      "Capture failed:",
                      err.response?.data || err.message
                    );
                    toast.error(
                      "Payment captured, but order failed. Contact support."
                    );
                  }
                }}
                onCancel={(data) => {
                  console.log("Payment cancelled:", data);
                  toast("Payment cancelled");
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  toast.error("Payment failed");
                }}
              />

              <Link
                to={ROUTES.CART}
                className='block text-center bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition'
              >
                Back to Cart
              </Link>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className='bg-white rounded-lg p-6 border h-fit sticky top-4'>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>
              Order Summary
            </h2>

            <div className='space-y-3 mb-6 max-h-96 overflow-y-auto'>
              {detailedCartaItem.map((item) => (
                <div
                  key={item.id}
                  className='flex justify-between text-sm text-gray-700 pb-2 border-b'
                >
                  <div>
                    <p className='font-semibold'>{item.productName}</p>
                    <p className='text-xs text-gray-500'>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className='font-semibold'>
                    ${(item.productPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className='space-y-3 border-t pt-4'>
              <div className='flex justify-between text-gray-700'>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-gray-700'>
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-lg font-bold text-gray-900 pt-3 border-t'>
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
