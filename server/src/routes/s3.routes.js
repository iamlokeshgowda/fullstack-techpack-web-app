import { Router } from "express";
import { presignFiles } from "../controllers/s3/presign.js";

const router = Router();

router.post("/presign", presignFiles);

export default router;
