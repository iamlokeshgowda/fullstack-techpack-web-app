import { Router } from "express";
import {
  createPaypalOrder,
  capturePayment,
} from "../controllers/paypal/createPaypalOrder.js";
import { authorize } from "../middlewares/auth.middleware.js";
import { updatePaypalOrderStatus } from "../controllers/paypal/updatePaypalOrderStatus.js";
const router = Router();
router.use(authorize());
router.post("/create-order", createPaypalOrder);
router.post("/capture-order", capturePayment);
router.post("/update-status", updatePaypalOrderStatus);

export default router;
