import { Router } from "express";
import { register } from "../controllers/auth/register.js";
import { verifyEmailToken } from "../controllers/auth/verifyEmailToken.js";
import { resendVerificationEmail } from "../controllers/auth/reVerifyEmailToken.js";
import { manualLogin } from "../controllers/auth/login.js";

const router = Router();

router.post("/register", register);
router.get("/verify-email/:token", verifyEmailToken);
router.post("/resend-verification", resendVerificationEmail);
router.post("/login", manualLogin);

export default router;
