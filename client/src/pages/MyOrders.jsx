import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/axios";
import ordersService from "../services/orders.service";
import { ROUTES } from "../utils/constants";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [downloadingItemId, setDownloadingItemId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/orders");
      setOrders(response.data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = async (orderItem) => {
    try {
      setDownloadingItemId(orderItem.id);
      toast.success("Download started!");
      await ordersService.downloadFile(
        orderItem.id,
        `${orderItem.product.productSlug}.zip`
      );
      toast.success("Download completed!");
    } catch (error) {
      toast.error("Failed to download file");
      console.error(error);
    } finally {
      setDownloadingItemId(null);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900">No Orders Yet</h1>
        <p className="text-gray-600">You haven't placed any orders yet.</p>
        <Link
          to={ROUTES.HOME}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Link
            to={ROUTES.HOME}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Order Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Items
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "shipped"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.orderItems.length} item
                      {order.orderItems.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          setExpandedOrderId(
                            expandedOrderId === order.id ? null : order.id
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        {expandedOrderId === order.id ? "Hide" : "View"} Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expanded Order Details */}
        {expandedOrderId && (
          <div className="mt-6 bg-white rounded-lg border shadow-sm p-6">
            {orders
              .filter((order) => order.id === expandedOrderId)
              .map((order) => (
                <div key={order.id}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Order Details: {order.orderNumber}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          Shipping Address
                        </h3>
                        <p className="text-gray-600">
                          {order.firstName} {order.lastName}
                        </p>
                        <p className="text-gray-600">{order.address}</p>
                        <p className="text-gray-600">
                          {order.city}, {order.state} {order.zipCode}
                        </p>
                        <p className="text-gray-600">{order.country}</p>
                        <p className="text-gray-600 mt-2">
                          Email: {order.email}
                        </p>
                        <p className="text-gray-600">Phone: {order.phone}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          Order Summary
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-semibold text-gray-900">
                              ${parseFloat(order.subtotal).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax:</span>
                            <span className="font-semibold text-gray-900">
                              ${parseFloat(order.tax).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-bold text-gray-900">
                              Total:
                            </span>
                            <span className="font-bold text-lg text-gray-900">
                              ${parseFloat(order.total).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border"
                          >
                            <div>
                              <p className="font-semibold text-gray-900">
                                {item?.product.productName}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × $
                                {parseFloat(item.productPrice).toFixed(2)} = $
                                {(
                                  item.quantity * parseFloat(item.productPrice)
                                ).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">
                                Downloads: {item.downloadItemCount}
                              </span>
                            </div>

                            {item.downloadItemCount < 5 ? (
                              <button
                                onClick={() => handleDownloadZip(item)}
                                disabled={downloadingItemId === item.id}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm transition
                                  ${
                                    downloadingItemId === item.id
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-blue-600 hover:bg-blue-700 text-white"
                                  }`}
                              >
                                {downloadingItemId === item.id
                                  ? "Downloading…"
                                  : "📥 Download Zip"}
                              </button>
                            ) : (
                              <div className="text-red-600 font-semibold">
                                Download limit reached
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            <div className="flex justify-between pt-6 border-t">
              <button
                onClick={() => setExpandedOrderId(null)}
                className="text-gray-600 hover:text-gray-900 font-semibold"
              >
                Hide Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
