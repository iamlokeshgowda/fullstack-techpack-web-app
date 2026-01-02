import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";

const prisma = new PrismaClient();

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;
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

    await prisma.cartItem.deleteMany({ where: { userId, productId } });
    return sendResponse(res, { message: "Removed from cart" });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to remove cart item",
      error: error.message,
    });
  }
};
