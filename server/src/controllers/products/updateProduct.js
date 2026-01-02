import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";
import {
  isProductSlugExists,
  isCategoryExists,
  normalizeImages,
} from "./product.helper.js";

const prisma = new PrismaClient();

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
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

    // check product exists
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Product not found",
      });
    }

    // slug unique
    if (productSlug && (await isProductSlugExists(productSlug, id))) {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message: "Product slug already exists",
      });
    }

    // validate category
    if (catId && !(await isCategoryExists(catId))) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid category",
      });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        productSlug: productSlug ?? existing.productSlug,
        productName: productName ?? existing.productName,
        metaDesc: metaDesc ?? existing.metaDesc,
        metaKeyword: metaKeyword ?? existing.metaKeyword,
        metaJson: metaJson ?? existing.metaJson,
        shortDescription: shortDescription ?? existing.shortDescription,
        longDescription: longDescription ?? existing.longDescription,
        addiInfo: addiInfo ?? existing.addiInfo,
        productPrice: productPrice ?? existing.productPrice,
        catId: catId ?? existing.catId,
        images:
          images !== undefined ? normalizeImages(images) : existing.images,
        downloadLink:
          downloadLink !== undefined ? downloadLink : existing.downloadLink,
        isActive: typeof isActive === "boolean" ? isActive : existing.isActive,
      },
    });

    return sendResponse(res, {
      message: "Product updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Update product error", err);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to update product",
      error: err.message,
    });
  }
};
