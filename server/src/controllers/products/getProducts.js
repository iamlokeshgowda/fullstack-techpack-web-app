import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";
import { buildCategoryPath } from "./product.helper.js";

const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        productSlug: true,
        productName: true,
        productPrice: true,
        images: true,
        isActive: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            catName: true,
            catSlug: true,
            parentId: true,
          },
        },
      },
    });

    const formattedProducts = await Promise.all(
      products.map(async (product) => ({
        id: product.id,
        productSlug: product.productSlug,
        productName: product.productName,
        productPrice: product.productPrice,
        images: product.images[0] ? product.images[0] : null,
        isActive: product.isActive,
        updatedAt: product.updatedAt,
        categoryPath: product.category
          ? await buildCategoryPath(product.category)
          : [],
      }))
    );

    return sendResponse(res, {
      message: "Products fetched successfully",
      data: formattedProducts,
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
