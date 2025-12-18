import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { getProducts } from "../controllers/products/getProducts.js";
import { createProduct } from "../controllers/products/createProduct.js";
import { deleteProduct } from "../controllers/products/deleteProduct.js";

const router = Router();

router.get("/products", getProducts);
router.post("/product", createProduct);
// router.put("/categories/:id", authorize("ADMIN USER"), updateCategory);
router.delete("/product/:id", authorize("ADMIN"), deleteProduct);

export default router;
