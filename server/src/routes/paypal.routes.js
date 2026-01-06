import { Router } from "express";
import {
  createPaypalOrder,
  capturePayment,
} from "../controllers/paypal/createPaypalOrder.js";
import { authorize } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(authorize());
router.post("/create-order", createPaypalOrder);
router.post("/capture-order", capturePayment);

export default router;
