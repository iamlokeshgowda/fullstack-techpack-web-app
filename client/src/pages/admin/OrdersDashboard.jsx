import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axiosInstance from "../../services/axios";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { SERVER_ROUTES } from "../../utils/constants";
import api from "../../services/axios";

export default function OrdersDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get(SERVER_ROUTES.ORDERS);

      setDashboard(response?.data ?? []);
    } catch (error) {
      toast.error("Failed to fetch order dashboard");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <AdminLayout>
        <Spinner />
      </AdminLayout>
    );
  }

  if (!dashboard) {
    return (
      <AdminLayout>
        <div className="text-center text-gray-600">No data available</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-semibold">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {dashboard.summary.totalOrders}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-semibold">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ${Number(dashboard?.summary?.totalRevenue || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm font-semibold">
              Avg Order Value
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              ${Number(dashboard?.summary?.avgOrderValue || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
            <h3 className="text-gray-500 text-sm font-semibold">Total Items</h3>
            <p className="text-3xl font-bold text-gray-900">
              {dashboard.summary.totalItems}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-pink-500">
            <h3 className="text-gray-500 text-sm font-semibold">
              Total Downloads
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {dashboard.summary.totalDownloads}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Orders
            </h2>
            <div className="space-y-3">
              {dashboard?.recentOrders?.length > 0 ? (
                dashboard?.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded border"
                  >
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">
                        {order.id}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {order.user.name} -- {order.user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 font-bold text-sm">
                        ${Number(order?.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No orders yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Orders Grouped By User */}
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Orders Grouped By User
          </h2>

          {dashboard?.groupedByUser?.length > 0 ? (
            <div className="space-y-5">
              {dashboard.groupedByUser.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="mb-3">
                    <p className="font-bold text-gray-900">
                      {user.firstName} {user.lastName}{" "}
                      <span className="text-sm text-gray-500">
                        ({user.email})
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">User ID: {user.id}</p>
                  </div>

                  {user.orders?.length > 0 ? (
                    <div className="space-y-3">
                      {user.orders.map((order) => (
                        <div
                          key={order.id}
                          className="p-3 rounded border bg-white"
                        >
                          <div className="flex justify-between">
                            <p className="font-semibold text-sm text-gray-900">
                              Order #{order.id}
                            </p>
                            <p className="font-semibold text-sm text-gray-900">
                              Ordered Date:{" "}
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : ""}
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              $
                              {Number(
                                order?.totalAmount ??
                                  order?.orderItems?.reduce(
                                    (sum, item) =>
                                      sum +
                                      Number(item.productPrice) *
                                        Number(item.quantity),
                                    0
                                  )
                              ).toFixed(2)}
                            </p>
                          </div>

                          <div className="mt-2 text-xs text-gray-500">
                            {order.orderItems?.map((item) => (
                              <p key={item.id}>
                                {item.product.productName} — Qty:{" "}
                                {item.quantity} — Downloads:{" "}
                                {item.downloadItemCount}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No orders for this user
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No user order data</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
