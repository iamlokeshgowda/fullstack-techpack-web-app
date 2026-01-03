import axiosInstance from "./axios";

export const ordersService = {
  // Create a new order
  createOrder: async (orderData) => {
    const response = await axiosInstance.post("/orders", orderData);
    return response.data;
  },

  // Get all user orders
  getUserOrders: async () => {
    const response = await axiosInstance.get("/orders");
    return response.data;
  },

  // Get a specific order by ID
  getOrderById: async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  },

  // Download file from URL
  // Download an order item's file via server proxy so the real URL is hidden
  downloadFile: async (orderItemId, filename) => {
    const res = await axiosInstance.get(
      `/orders/order-items/${orderItemId}/download`,
      { responseType: "blob" }
    );

    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    window.URL.revokeObjectURL(url);
  },
};

export default ordersService;
