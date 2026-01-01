import { Router } from "express";
import { getPublicCategories } from "../controllers/public/categories.js";
import { getPublicProducts } from "../controllers/public/products.js";

const router = Router();

router.get("/categories", getPublicCategories);
router.get("/products", getPublicProducts);

export default router;
