import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import {
  deleteCategory,
  updateCategory,
} from "../controllers/categories/index.js";
import { getProducts } from "../controllers/products/getProducts.js";
import { createProduct } from "../controllers/products/createProduct.js";

const router = Router();

router.get("/products", getProducts);
router.post("/product", createProduct);
// router.put("/categories/:id", authorize("ADMIN USER"), updateCategory);
// router.delete("/categories/:id", authorize("ADMIN"), deleteCategory);

export default router;
