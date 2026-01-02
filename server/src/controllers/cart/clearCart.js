import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";

const prisma = new PrismaClient();

export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId)
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });

    await prisma.cartItem.deleteMany({ where: { userId } });
    return sendResponse(res, { message: "Cart cleared" });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};
