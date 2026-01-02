import { Router } from "express";
import { getPublicCategories } from "../controllers/public/categories.js";
import {
  getPublicProducts,
  getPublicProductBySlug,
} from "../controllers/public/products.js";

const router = Router();

router.get("/categories", getPublicCategories);
router.get("/products", getPublicProducts);
router.get("/product/:slug", getPublicProductBySlug);

export default router;
