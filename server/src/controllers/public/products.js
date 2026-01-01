import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";

const prisma = new PrismaClient();

export const getPublicProducts = async (req, res) => {
  try {
    let products = await prisma.product.findMany({
      select: {
        id: true,
        productSlug: true,
        productName: true,
        productPrice: true,
        isActive: true,
        updatedAt: true,
        images: true, // <-- get full array
        category: {
          select: { id: true },
        },
      },
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    // 🔥 transform to return only first image (or empty string)
    products = products.map((item) => ({
      ...item,
      category: item.category.id,
    }));

    return sendResponse(res, {
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("PRODUCT ERROR:", error);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
