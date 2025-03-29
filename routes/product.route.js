import express from "express";
import { ProductController } from "../controller/product.controller.js";

const router = express.Router();

router.get('/allproduct',ProductController.getAllProduct);
router.get('/getproductbyid',ProductController.getProductById);
router.get('/getProductsByCategory', ProductController.getProductByCategory);

// search and filter
router.get('/filtersbycategory', ProductController.getFiltersByCategory);
router.post('/products/filtered', ProductController.getFilteredProducts);


//homescreen products
router.get('/getHomeProducts',ProductController.getHomeProducts);

//ratings
router.get('/getrating',ProductController.getReviewAndRating);
router.get('/getratingbyid',ProductController.getReviewAndRatingById);
router.post('/addrating',ProductController.addReviewAndRating);


export default router;