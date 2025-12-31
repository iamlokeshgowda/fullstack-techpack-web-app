import { Router } from "express";
import { getPublicCategories } from "../controllers/public/category.controller.js";

const router = Router();

router.get("/categories", getPublicCategories);

export default router;
