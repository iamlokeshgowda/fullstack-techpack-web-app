import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🔍 Check product exists by ID
 */
export const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

/**
 * 🔍 Check product exists by slug
 */
export const getProductBySlug = async (productSlug) => {
  return prisma.product.findUnique({
    where: { productSlug },
  });
};

/**
 * 🔁 Check duplicate product slug
 * excludeId → used during update
 */
export const isProductSlugExists = async (productSlug, excludeId = null) => {
  const where = excludeId
    ? { productSlug, NOT: { id: excludeId } }
    : { productSlug };

  const product = await prisma.product.findFirst({ where });
  return !!product;
};

/**
 * 🔗 Check category exists (before assigning catId)
 */
export const isCategoryExists = async (catId) => {
  if (!catId) return false;

  const category = await prisma.category.findUnique({
    where: { id: catId },
  });

  return !!category;
};

/**
 * 🖼 Normalize images array (safety)
 */
export const normalizeImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  return [images];
};

export const buildCategoryPath = async (category) => {
  const path = [];

  let current = category;

  while (current) {
    path.unshift({
      id: current.id,
      catName: current.catName,
      catSlug: current.catSlug,
    });

    if (!current.parentId) break;

    current = await prisma.category.findUnique({
      where: { id: current.parentId },
      select: {
        id: true,
        catName: true,
        catSlug: true,
        parentId: true,
      },
    });
  }

  return path;
};
