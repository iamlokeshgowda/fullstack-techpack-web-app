import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";
import {
  isSlugExists,
  validateParentCategory,
  getCategoryById,
  hasChildCategories,
  hasProductsInCategory,
} from "./category.helper.js";

const prisma = new PrismaClient();

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    return sendResponse(res, {
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const {
      catName,
      catSlug,
      catMetaDesc,
      catMetaKeyword,
      parentId = null,
      isActive = true,
    } = req.body;

    if (!catName || !catSlug) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Category name and slug are required",
      });
    }

    if (await isSlugExists(catSlug)) {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message: "Category slug already exists",
      });
    }
    if (!(await validateParentCategory(null, parentId))) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid parent category",
      });
    }

    const category = await prisma.category.create({
      data: {
        catName,
        catSlug,
        catMetaDesc,
        catMetaKeyword,
        parentId: parentId || null,
        isActive,
      },
    });

    return sendResponse(res, {
      statusCode: 201,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const category = await getCategoryById(id);
    if (!category) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Category not found",
      });
    }

    if (payload.catSlug && (await isSlugExists(payload.catSlug, id))) {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message: "Category slug already exists",
      });
    }

    if (!(await validateParentCategory(id, payload.parentId))) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid parent category assignment",
      });
    }
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: payload,
    });

    return sendResponse(res, {
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Check category exists
    const category = await getCategoryById(id);
    if (!category) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Category not found",
      });
    }

    // 📦 Check products exist under this category
    if (await hasProductsInCategory(id)) {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message: "Cannot delete category. Products exist under this category.",
      });
    }

    // 🌳 Check child categories
    if (await hasChildCategories(id)) {
      return sendResponse(res, {
        statusCode: 409,
        success: false,
        message:
          "Cannot delete category. Please delete or reassign child categories first.",
      });
    }

    // ✅ Delete category
    await prisma.category.delete({ where: { id } });

    return sendResponse(res, {
      message: "Category deleted successfully",
    });
  } catch (error) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
