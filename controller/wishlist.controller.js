
import { Wishlist, Product,Rating } from "../models/index.js";
import { dataFound, parameterNotFound, dataNotFound, otpGenerator, responseGenerator  } from "../helper/function.helper.js";
import STATUSCODE from "../server/statusCode.js";

import { Op } from "sequelize";
import wishlists from "../models/wishlists.model.js";

export class WishlistController {
    static addToWishlist = async (req, res, next) => {
        const { user_id, product_id } = req.body;

        try {
            const existingWishlist = await Wishlist.findOne({ where: { user_id, product_id } });
            if (existingWishlist) {
                return responseGenerator(res, "Product already in wishlist", STATUSCODE.OK, existingWishlist);
            }

            const newWishlist = await wishlists.create({
                user_id,
                product_id,
                status: true,
                created_at: new Date(),
                updated_at: new Date(),
            });
            const productDetails = await Product.findOne({ where: { id: product_id } });

            return responseGenerator(res, "Product added to wishlist successfully", STATUSCODE.CREATED, { wishlist: newWishlist, product: productDetails });
        } catch (error) {
            next(error);
        }
    };

  
    static getWishlistByUser = async (req, res, next) => {
        const { user_id } = req.query;
        const image_path = 'https://123ecommerce.co.za/public/front/images/product_images/large/';
    
        try {
            // Fetch wishlist items based on user_id and status
            const wishlist = await Wishlist.findAll({
                where: { user_id, status: 1 },
                raw: true
            });
    
            if (!wishlist || wishlist.length === 0) {
                return responseGenerator(res, "No items found in wishlist", STATUSCODE.OK, wishlist);
            }
    
            // Extract product_ids from wishlist items
            const productIds = wishlist.map(item => Number(item.product_id));
    
            // Fetch product details for each product_id
            const products = await Product.findAll({
                where: {
                    id: productIds
                },
                raw: true 
            });
    
            const ratings = await Rating.findAll({
                where: {
                    product_id: productIds
                },
                raw: true
            });
    
            // Calculate average ratings and map to products
            const averageRatingsMap = {};
            products.forEach(product => {
                const productRatings = ratings.filter(r => r.product_id === Number(product.id));
                const averageRating = productRatings.length > 0
                    ? Math.round(productRatings.reduce((sum, rating) => sum + rating.rating, 0) / productRatings.length)
                    : 0;
                averageRatingsMap[product.id] = averageRating;
            });
    
            const wishlistWithProducts = wishlist.map(item => {
                const product = products.find(p => p.id === Number(item.product_id));
                const productRatings = ratings.filter(r => r.product_id === Number(item.product_id));
    
                return {
                   
                    productDetails: product ? {
                        ...product,
                        imageUrl: image_path + product.product_image,
                        ratings: productRatings,
                        averageRating: averageRatingsMap[product.id]  
                    } : null
                };
            });
    
            return responseGenerator(res, "Wishlist retrieved successfully", STATUSCODE.OK, wishlistWithProducts);
        } catch (error) {
            next(error);
        }
    };
    
    
    



    static getallWishlist = async (req, res, next) => {
        // const { user_id } = req.query;

        try {
            const wishlist = await Wishlist.findAll();
            if (!wishlist || wishlist.length === 0) {
                return responseGenerator(res, "No items found in wishlist", STATUSCODE.NOT_FOUND);
            }
            return responseGenerator(res, "Wishlist retrieved successfully", STATUSCODE.OK, wishlist);
        } catch (error) {
            next(error);
        }
    };

    static removeFromWishlist = async (req, res, next) => {
        const { user_id, product_id } = req.body;

        try {
            const deleted = await Wishlist.destroy({ where: { user_id, product_id } });

            if (!deleted) {
                return responseGenerator(res, "Item not found in wishlist", STATUSCODE.NOT_FOUND);
            }
            return responseGenerator(res, "Item removed from wishlist successfully", STATUSCODE.OK);
        } catch (error) {
            next(error);
        }
    };
    static updateWishlistItem = async (req, res, next) => {
        const { user_id } =req.query;
        const { product_id, status } = req.body;

        try {
            const updatedWishlist = await wishlists.update(
                { status, updated_at: new Date() },
                { where: { user_id, product_id } }
            );

            if (updatedWishlist[0] === 0) {
                return responseGenerator(res, "Item not found in wishlist", STATUSCODE.NOT_FOUND);
            }

            return responseGenerator(res, "Wishlist item updated successfully", STATUSCODE.OK);
        } catch (error) {
            next(error);
        }
    };
}