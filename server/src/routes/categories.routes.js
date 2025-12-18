import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categories/category.controller.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/category", authorize("ADMIN"), createCategory);
router.put("/category/:id", authorize("ADMIN"), updateCategory);
router.delete("/category/:id", authorize("ADMIN"), deleteCategory);

export default router;
