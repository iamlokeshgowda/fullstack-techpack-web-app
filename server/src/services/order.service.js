import prisma from "../config/prisma.js";

export async function prepareOrderItems(items) {
  if (!items?.length) throw new Error("Cart is empty");

  const productIds = items.map((item) => item.id);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      productPrice: true,
    },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;

  const updatedItems = items.map((item) => {
    const product = productMap.get(item.id);

    if (!product) throw new Error(`Product not found: ${item.id}`);

    const total = product.productPrice * item.quantity;
    subtotal += total;

    return {
      productId: product.id,
      price: product.productPrice,
      quantity: item.quantity,
      total,
    };
  });

  return {
    items: updatedItems,
    subtotal: Number(subtotal.toFixed(2)),
  };
}
