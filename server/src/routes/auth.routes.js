import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const router = Router();

// REGISTER → POST (correct REST method)
router.post("/register", register);

export default router;
