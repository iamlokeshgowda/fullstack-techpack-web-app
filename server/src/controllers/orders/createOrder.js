import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function createOrder() {
  try {
    const { items, customerInfo, shippingAddress, subtotal, tax, total } =
      req.body;
    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain items" });
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)
      .toUpperCase()}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax),
        total: parseFloat(total),
        status: "pending",
        orderItems: {
          create: items.map((item) => ({
            productId: item.id,
            productName: item.productName,
            productSlug: item.productSlug,
            productPrice: parseFloat(item.productPrice),
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    // Clear the user's cart
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
}
