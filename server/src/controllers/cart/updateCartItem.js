import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";

const prisma = new PrismaClient();

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!userId)
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });
    if (!productId)
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "productId required",
      });
    if (typeof quantity !== "number")
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "quantity required and must be a number",
      });

    const existing = await prisma.cartItem
      .findUnique({ where: { userId_productId: { userId, productId } } })
      .catch(() => null);

    if (!existing) {
      // create new cart item using product snapshot
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product)
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Product not found",
        });

      const created = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity: Number(quantity),
        },
      });

      return sendResponse(res, { message: "Cart item created", data: created });
    }

    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: Number(quantity) },
    });
    return sendResponse(res, { message: "Cart item updated", data: updated });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to update cart item",
      error: error.message,
    });
  }
};
