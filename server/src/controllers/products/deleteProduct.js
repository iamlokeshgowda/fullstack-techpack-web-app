import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";
import { getProductById } from "./product.helper.js";

const prisma = new PrismaClient();

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Check product exists
    const product = await getProductById(id);

    if (!product) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Delete product
    await prisma.product.delete({
      where: { id },
    });

    return sendResponse(res, {
      message: "Product deleted successfully",
    });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
