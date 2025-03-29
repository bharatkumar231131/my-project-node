import express from "express";
import { WishlistController } from "../controller/wishlist.controller.js";

const router = express.Router();

router.post('/addwishlist',WishlistController.addToWishlist);
router.get('/getuserwishlist',WishlistController.getWishlistByUser);
router.get('/getallrwishlist',WishlistController.getallWishlist);
router.put('/updateuserwishlist',WishlistController.updateWishlistItem);
router.delete('/deleteuserwishlist',WishlistController.removeFromWishlist);

export default router;