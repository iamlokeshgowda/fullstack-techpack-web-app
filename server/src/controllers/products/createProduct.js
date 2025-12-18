import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";

const prisma = new PrismaClient();

import {
  isProductSlugExists,
  isCategoryExists,
  normalizeImages,
} from "./product.helper.js";

export const createProduct = async (req, res) => {
  const {
    productSlug,
    productName,
    productPrice,
    catId,
    images,
    downloadLink,
  } = req.body;

  if (await isProductSlugExists(productSlug)) {
    return sendResponse(res, {
      statusCode: 409,
      success: false,
      message: "Product slug already exists",
    });
  }

  if (!(await isCategoryExists(catId))) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid category",
    });
  }

  const product = await prisma.product.create({
    data: {
      productSlug,
      productName,
      productPrice,
      catId,
      images: normalizeImages(images),
      downloadLink,
    },
  });

  return sendResponse(res, {
    statusCode: 201,
    message: "Product created successfully",
    data: product,
  });
};
