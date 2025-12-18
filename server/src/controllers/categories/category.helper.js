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
export const isSlugExists = async (catSlug, excludeId = null) => {
  const where = excludeId ? { catSlug, NOT: { id: excludeId } } : { catSlug };

  const category = await prisma.category.findFirst({ where });
  return !!category;
};

// 🚫 Validate parent assignment
export const validateParentCategory = async (id, parentId) => {
  if (!parentId) return true;

  // Self-parenting
  if (id === parentId) return false;

  // Parent is child (1-level deep protection)
  const invalidParent = await prisma.category.findFirst({
    where: {
      id: parentId,
      parentId: id,
    },
  });

  return !invalidParent;
};

export const hasProductsInCategory = async (categoryId) => {
  const count = await prisma.product.count({
    where: { catId: categoryId },
  });
  return count > 0;
};
