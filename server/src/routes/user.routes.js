import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { getCart } from "../controllers/cart/getCart.js";
import { addToCart } from "../controllers/cart/addToCart.js";
import { removeFromCart } from "../controllers/cart/removeFromCart.js";
import { clearCart } from "../controllers/cart/clearCart.js";
import { updateCartItem } from "../controllers/cart/updateCartItem.js";
const router = Router();

router.get("/cart", authorize(), getCart);
router.post("/cart", authorize(), addToCart);
router.delete("/cart/:productId", authorize(), removeFromCart);
router.patch("/cart/:productId", authorize(), updateCartItem);
router.delete("/cart", authorize(), clearCart);

export default router;
