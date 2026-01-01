import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../../utils/response.js";

const prisma = new PrismaClient();

export const getPublicCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        catName: true,
        catSlug: true,
        parentId: true,
        isActive: true,
        createdAt: true,
      },
      where: { isActive: true },
    });

    const categoryMap = new Map();

    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    const categoryTree = [];

    categories.forEach((cat) => {
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(categoryMap.get(cat.id));
        }
      } else {
        categoryTree.push(categoryMap.get(cat.id));
      }
    });

    return sendResponse(res, {
      message: "Categories fetched successfully",
      data: categoryTree,
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
