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
    metaDesc,
    metaKeyword,
    metaJson,
    shortDescription,
    longDescription,
    addiInfo,
    productPrice,
    catId,
    images,
    downloadLink,
    isActive,
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
      metaDesc: metaDesc || null,
      metaKeyword: metaKeyword || null,
      metaJson: metaJson || null,
      shortDescription: shortDescription || null,
      longDescription: longDescription || null,
      addiInfo: addiInfo || null,
      productPrice,
      catId,
      images: normalizeImages(images),
      downloadLink,
      isActive: typeof isActive === "boolean" ? isActive : true,
    },
  });

  return sendResponse(res, {
    statusCode: 201,
    message: "Product created successfully",
    data: product,
  });
};
