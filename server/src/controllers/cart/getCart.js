import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";

const prisma = new PrismaClient();

export const getCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });
    }

    const items = await prisma.cartItem.findMany({ where: { userId } });

    return sendResponse(res, { message: "Cart fetched", data: items });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};
