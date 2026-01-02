import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId)
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        role: true,
        provider: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return sendResponse(res, { message: "Profile fetched", data: user });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};
