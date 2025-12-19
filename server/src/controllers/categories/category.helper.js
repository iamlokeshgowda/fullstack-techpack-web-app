import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔍 Check category exists
export const getCategoryById = async (id) => {
  return prisma.category.findUnique({ where: { id } });
};

// 🚫 Check child categories
export const hasChildCategories = async (id) => {
  const count = await prisma.category.count({
    where: { parentId: id },
  });
  return count > 0;
};

// 🔁 Check duplicate slug (exclude current category)
export const isSlugExists = async (
  catSlug,
  parentId = null,
  excludeId = null
) => {
  const where = {
    catSlug,
    parentId: parentId ?? null,
    ...(excludeId && { NOT: { id: excludeId } }),
  };

  const category = await prisma.category.findFirst({ where });
  return !!category;
};

export const validateParentCategory = async (id, parentId) => {
  // ✅ Root category
  if (!parentId) return true;

  // 🔍 Parent must exist
  const parentCategory = await prisma.category.findUnique({
    where: { id: parentId },
  });

  if (!parentCategory) {
    return false; // ❌ Invalid parent
  }

  // 🚫 Self-parenting (update case)
  if (id && id === parentId) {
    return false;
  }

  // 🚫 Prevent 1-level cycle (update case)
  if (id) {
    const invalidParent = await prisma.category.findFirst({
      where: {
        id: parentId,
        parentId: id,
      },
    });

    if (invalidParent) return false;
  }

  return true;
};

export const hasProductsInCategory = async (categoryId) => {
  const count = await prisma.product.count({
    where: { catId: categoryId },
  });
  return count > 0;
};
