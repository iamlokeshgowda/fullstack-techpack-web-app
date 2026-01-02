import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import createOrder from "../controllers/orders/createOrder.js";
import getUserOrders from "../controllers/orders/getUserOrders.js";
import getOrderById from "../controllers/orders/getOrderById.js";
import downloadOrderItem from "../controllers/orders/downloadOrderItem.js";

const router = Router();

// All routes require authentication
router.use(authorize());

// Create order
router.post("/", createOrder);

// Get user's orders
router.get("/", getUserOrders);

// Get specific order
router.get("/:orderId", getOrderById);

// Download an order item's product zip (proxied)
router.get("/order-items/:id/download", downloadOrderItem);

export default router;
