import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { getProducts } from "../controllers/products/getProducts.js";
import { createProduct } from "../controllers/products/createProduct.js";
import { deleteProduct } from "../controllers/products/deleteProduct.js";
import { updateProduct } from "../controllers/products/updateProduct.js";
import { getProduct } from "../controllers/products/getProduct.js";

const router = Router();

router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.post("/product", authorize("ADMIN"), createProduct);
router.put("/product/:id", authorize("ADMIN"), updateProduct);
router.delete("/product/:id", authorize("ADMIN"), deleteProduct);

export default router;
