import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";
import { buildCategoryPath } from "../products/product.helper.js";

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

export const getPublicProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { productSlug: slug },
      select: {
        id: true,
        productSlug: true,
        productName: true,
        metaDesc: true,
        metaKeyword: true,
        metaJson: true,
        shortDescription: true,
        longDescription: true,
        addiInfo: true,
        productPrice: true,
        images: true,
        downloadLink: true,
        isActive: true,
        createdAt: true,
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

    if (!product) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Product not found",
      });
    }

    // Build category path
    const categoryPath = product.category
      ? await buildCategoryPath(product.category)
      : [];

    const formattedProduct = {
      ...product,
      categoryPath,
    };

    return sendResponse(res, {
      message: "Product fetched successfully",
      data: formattedProduct,
    });
  } catch (error) {
    console.error("GET PRODUCT BY SLUG ERROR:", error);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};
