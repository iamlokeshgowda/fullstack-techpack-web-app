import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch"; // only if NOT on Node 18+
const prisma = new PrismaClient();

export default async function downloadOrderItem(req, res) {
  try {
    const userId = req.user.userId;
    const { id: orderItemId } = req.params;

    // 1️⃣ Validate ownership
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { order: true },
    });

    if (!orderItem)
      return res.status(404).json({ message: "Order item not found" });

    if (orderItem.order.userId !== userId)
      return res.status(403).json({ message: "Access denied" });

    // 2️⃣ Get download URL
    let downloadUrl = orderItem.downloadLink;

    if (!downloadUrl) {
      const product = await prisma.product.findUnique({
        where: { id: orderItem.productId },
        select: { downloadLink: true },
      });
      downloadUrl = product?.downloadLink;
    }

    if (!downloadUrl)
      return res.status(404).json({ message: "Download not available" });

    // 3️⃣ Increment download counts (product and orderItem)
    await Promise.all([
      prisma.product.update({
        where: { id: orderItem.productId },
        data: { downloadCount: { increment: 1 } },
      }),
      prisma.orderItem.update({
        where: { id: orderItemId },
        data: { downloadItemCount: { increment: 1 } },
      }),
    ]);

    // 4️⃣ Fetch the file from storage
    const upstream = await fetch(downloadUrl);

    if (!upstream.ok)
      return res.status(502).json({ message: "Failed to fetch file" });

    // 5️⃣ Set headers so browser downloads
    const contentType =
      upstream.headers.get("content-type") || "application/octet-stream";

    const filename = `${orderItem.productSlug || "download"}.zip`;

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // 6️⃣ 🚀 STREAM — this is critical!
    upstream.body.pipe(res);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
