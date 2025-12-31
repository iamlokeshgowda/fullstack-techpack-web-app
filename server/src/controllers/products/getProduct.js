import { sendResponse } from "../../utils/response.js";
import { getProductById } from "./product.helper.js";

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Product not found",
      });
    }
    return sendResponse(res, { message: "Product fetched", data: product });
  } catch (err) {
    console.error("Get product error", err);
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch product",
      error: err.message,
    });
  }
};
