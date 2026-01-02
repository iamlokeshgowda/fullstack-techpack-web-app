import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";

const prisma = new PrismaClient();

export const addToCart = async (req, res) => {
  console.log("req.....", req.body);

  try {
    const userId = req.user?.userId;
    if (!userId)
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });

    const { productId, quantity = 1 } = req.body;
    if (!productId)
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "productId required",
      });

    // fetch product snapshot
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product)
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Product not found",
      });

    const existing = await prisma.cartItem
      .findUnique({ where: { userId_productId: { userId, productId } } })
      .catch(() => null);

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + Number(quantity) },
      });
      return sendResponse(res, { message: "Cart updated", data: updated });
    }

    const created = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity: Number(quantity),
      },
    });

    return sendResponse(res, { message: "Added to cart", data: created });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to add to cart",
      error: error.message,
    });
  }
};
