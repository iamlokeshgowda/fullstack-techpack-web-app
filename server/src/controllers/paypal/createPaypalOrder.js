import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { getAccessToken } from "../../services/paypal.service.js";
import { prepareOrderItems } from "../../services/order.service.js";
const prisma = new PrismaClient();
import axios from "axios";

export async function createPaypalOrder(req, res) {
  try {
    const { items, customerInfo, shippingAddress, tax = 0 } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!customerInfo || !shippingAddress)
      return res
        .status(400)
        .json({ message: "Missing customer or shipping info" });

    // ✅ Secure price calculation
    const { items: updatedItems, subtotal } = await prepareOrderItems(items);
    const total = Number((subtotal + Number(tax)).toFixed(2));

    if (total <= 0) return res.status(400).json({ message: "Invalid amount" });

    const orderNumber = `ORD-${Date.now()}-${crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;

    // ✅ Get PayPal token
    const token = await getAccessToken();

    // ✅ Create PayPal order first
    const paypalResponse = await axios.post(
      process.env.PAYPAL_URL,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderNumber,
            amount: {
              currency_code: "USD",
              value: total.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: subtotal.toFixed(2),
                },
                tax_total: {
                  currency_code: "USD",
                  value: Number(tax).toFixed(2),
                },
              },
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": crypto.randomUUID(),
        },
      }
    );

    // ✅ Save order in DB
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        paypalOrderId: paypalResponse.data.id,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        subtotal,
        tax,
        total,
        status: "pending",

        orderItems: {
          create: updatedItems.map((item) => ({
            productId: item.productId,
            productPrice: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });
    res.json({ id: paypalResponse.data.id });
  } catch (error) {
    console.error("Create PayPal Order Error:", error.message);
    res
      .status(500)
      .json({ message: error.message || "Failed to create PayPal order" });
  }
}

export async function capturePayment(req, res) {
  const { orderID } = req.body;

  if (!orderID) {
    return res.status(400).json({ message: "PayPal orderID is required" });
  }

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { paypalOrderId: orderID },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      existingOrder.status === "COMPLETED" ||
      existingOrder.status === "paid"
    ) {
      return res.json({ message: "Order already paid", order: existingOrder });
    }

    const token = await getAccessToken();

    const response = await axios.post(
      `${process.env.PAYPAL_URL}/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.status !== "COMPLETED") {
      await prisma.order.update({
        where: { paypalOrderId: orderID },
        data: { status: "failed" },
      });

      return res.status(400).json({
        message: "Payment not completed",
        paypalStatus: data.status,
      });
    }

    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];

    const transactionId = capture?.id;
    const paidAmount = Number(capture?.amount?.value || 0);
    const currency = capture?.amount?.currency_code;
    const payerEmail = data.payer?.email_address;

    // ✅ Amount verification (anti-tampering)
    if (paidAmount !== Number(existingOrder.total)) {
      await prisma.order.update({
        where: { paypalOrderId: orderID },
        data: { status: "mismatch" },
      });

      return res.status(400).json({ message: "Amount mismatch detected" });
    }

    const updatedOrder = await prisma.order.update({
      where: { paypalOrderId: orderID },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
        transactionId,
        paidAmount,
        currency,
        payerEmail,
      },
    });

    res.json({
      message: "Payment successful",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "PayPal Capture Error:",
      error.response?.data || error.message
    );

    // ✅ Mark payment as failed in DB
    if (orderID) {
      await prisma.order.updateMany({
        where: { paypalOrderId: orderID },
        data: { status: "failed" },
      });
    }

    res.status(500).json({
      message: "Payment failed",
      paypal: error.response?.data || error.message,
    });
  }
}
