import prisma from "../../config/prisma.js";

export async function updatePaypalOrderStatus(req, res) {
  const { orderID, status } = req.body;
  console.log();
  if (!orderID || !status) {
    return res.status(400).json({ message: "orderID and status are required" });
  }

  const allowedStatuses = ["cancelled", "failed", "pending"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { paypalOrderId: orderID },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔒 Do not allow overriding a completed order
    if (order.status === "COMPLETED" || order.status === "paid") {
      return res.json({ message: "Order already completed" });
    }

    await prisma.order.update({
      where: { paypalOrderId: orderID },
      data: {
        status,
      },
    });

    res.json({ message: `Order marked as ${status}` });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
}
