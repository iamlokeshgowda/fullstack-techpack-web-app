import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllOrdersGroupedByUser = async (req, res) => {
  try {
    // Ensure admin access if required
    // if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });

    // === Fetch Users + Orders + Items ===
    const usersWithOrders = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        orders: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            createdAt: true,
            total: true,
            orderItems: {
              select: {
                id: true,
                productPrice: true,
                quantity: true,
                downloadItemCount: true,
                product: {
                  select: {
                    productName: true,
                    productSlug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // === Fetch Recent Orders (Latest 5) ===
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        total: true,
        user: {
          select: { id: true, name: true, email: true },
        },
        orderItems: {
          select: {
            productPrice: true,
            quantity: true,
          },
        },
      },
    });

    // === Compute Dashboard Stats ===
    let totalOrders = 0;
    let totalRevenue = 0;
    let totalItems = 0;
    let totalDownloads = 0;

    usersWithOrders.forEach((user) => {
      user.orders.forEach((order) => {
        totalOrders++;

        // If you do NOT have order.total, compute revenue from items
        const orderTotal =
          order.total ??
          order.orderItems.reduce(
            (sum, item) => sum + item.productPrice * item.quantity,
            0
          );

        totalRevenue += Number(orderTotal);

        order.orderItems.forEach((item) => {
          totalItems += item.quantity;
          totalDownloads += item.downloadItemCount ?? 0;
        });
      });
    });

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return res.json({
      success: true,
      message: "Admin order dashboard data loaded successfully",

      // === Dashboard Summary ===
      summary: {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        totalItems,
        totalDownloads,
      },

      // === Grouped By User ===
      groupedByUser: usersWithOrders,

      // === Recent Orders ===
      recentOrders,
    });
  } catch (error) {
    console.error("Admin Orders Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin orders",
      error: error.message,
    });
  }
};
