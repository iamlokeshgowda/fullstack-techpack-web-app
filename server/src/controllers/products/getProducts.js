import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";

const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  try {
    const categories = await prisma.Product.findMany();

    return sendResponse(res, {
      message: "Products fetched successfully",
      data: categories,
    });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
