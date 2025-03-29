import express from "express";
import { CartController } from "../controller/cart.controller.js";

const router = express.Router();

router.post('/additemtocart',CartController.addItemToCart);
router.get('/getitemcart',CartController.viewCartItems);
router.delete('/removeitemfromcart',CartController.removeItemFromCart);
router.delete('/emptycart',CartController.clearCart);
router.put('/cartUpdate', CartController.updateCartItem);
//router.post('/apply-coupon', CartController.applyCoupon);

export default router;