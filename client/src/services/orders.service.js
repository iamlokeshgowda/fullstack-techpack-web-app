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
  downloadFile: (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

export default ordersService;
