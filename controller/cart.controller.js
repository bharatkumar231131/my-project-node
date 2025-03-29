
import {Carts, Product} from "../models/index.js";
import { dataFound,parameterNotFound, dataNotFound, otpGenerator, responseGenerator } from "../helper/function.helper.js";
import STATUSCODE from "../server/statusCode.js";
import { Sequelize } from 'sequelize';
import sequelize from "../database/init.sql.js";
import users from '../models/users.model.js';
import coupons  from "../models/coupons.model.js";
import { Op } from "sequelize";
import products from "../models/products.model.js";

export class CartController {
        static addItemToCart = async (req, res, next) => {
            const { user_id, product_id, size, quantity } = req.body;
    
            try {
                
                const productAttribute = await sequelize.query(
                    `SELECT stock, price FROM products_attributes WHERE product_id = :product_id AND size = :size`,
                    {
                        replacements: { product_id: product_id, size: size },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
    
                if (!productAttribute || productAttribute.length === 0) {
                    return responseGenerator(res, "Product or size not found", STATUSCODE.NOT_FOUND);
                }
    
                const { stock, price } = productAttribute[0];
    
                if (quantity > stock) {
                    return responseGenerator(res, "Insufficient stock", STATUSCODE.BADREQUEST);
                }
    
                // Add item to cart if stock is sufficient
                const [newItem, created] = await Carts.findOrCreate({
                    where: {
                        user_id: user_id,
                        product_id: product_id,
                        size: size,
                    },
                    defaults: {
                        quantity: quantity,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
    
                const message = created
                    ? "Item added to cart successfully"
                    : "Item already exists in the cart";
    
                // Include the price in the response
                const response = {
                    ...newItem.dataValues,
                    price: price
                };
    
                return responseGenerator(res, message, STATUSCODE.CREATED, response);
            } catch (error) {
                console.error('Error occurred in addItemToCart:', error);
                next(error);
            }
        }

            static updateCartItem = async (req, res, next) => {
                const { user_id, product_id, size, quantity } = req.body;
        
                try {
                    
                    const productAttribute = await sequelize.query(
                        `SELECT stock, price FROM products_attributes WHERE product_id = :product_id AND size = :size`,
                        {
                            replacements: { product_id: product_id, size: size },
                            type: sequelize.QueryTypes.SELECT
                        }
                    );
        
console.log('attribute',productAttribute)

                    if (!productAttribute || productAttribute.length === 0) {
                        return responseGenerator(res, "Product or size not found", STATUSCODE.NOT_FOUND);
                    }
        
                    const { stock, price } = productAttribute[0];
        
                    if (quantity > stock) {
                        return responseGenerator(res, "Insufficient stock", STATUSCODE.BADREQUEST);
                    }
        
                    // Update item in cart if stock is sufficient
                    const updatedItem = await Carts.update(
                        {
                            quantity: quantity,
                            size: size,
                            updated_at: new Date()
                        },
                        {
                            where: {
                                user_id: user_id,
                                product_id: product_id,
                                size: size
                            }
                        }
                    );
        
                    if (updatedItem[0] === 0) {
                        return responseGenerator(res, "Item not found in cart", STATUSCODE.NOT_FOUND);
                    }
        
                    const response = {
                        user_id: user_id,
                        product_id: product_id,
                        size: size,
                        quantity: quantity,
                        price: price
                    };
        
                    return responseGenerator(res, "Item updated in cart successfully", STATUSCODE.OK, response);
                } catch (error) {
                    console.error('Error occurred in updateCartItem:', error);
                    next(error);
                }
            };
        

            // view cart -------------------------------
            static viewCartItems = async (req, res, next) => {
                const { user_id, coupon_code } = req.query;
                const image_path = "https://123ecommerce.co.za/public/front/images/product_images/large/";
            
                try {
                    const cartItems = await Carts.findAll({
                        where: {
                            ...(user_id && { user_id })
                        },
                        raw: true
                    });
            
                    let totalCartPrice = 0;
                    let totalDiscount = 0;
            
                    const cartItemsWithDetails = await Promise.all(
                        cartItems.map(async (cartItem) => {
                            const product = await Product.findOne({
                                where: { id: cartItem.product_id },
                                attributes: ["id", "product_name", "product_image", "product_code", "category_id", "brand_id"],
                                raw: true
                            });
            
                            const productAttributes = await sequelize.query(
                                `SELECT stock, price FROM products_attributes WHERE product_id = :product_id AND size = :size`,
                                {
                                    replacements: { product_id: cartItem.product_id, size: cartItem.size },
                                    type: sequelize.QueryTypes.SELECT
                                }
                            );
            
                            const productDetail = product
                                ? {
                                    ...product,
                                    product_image: `${image_path}${product.product_image}`,
                                    stock: productAttributes.length > 0 ? productAttributes[0].stock : null,
                                    unitPrice: productAttributes.length > 0 ? productAttributes[0].price : null,
                                    totalPrice: productAttributes.length > 0 ? productAttributes[0].price * cartItem.quantity : null
                                }
                                : null;
            
                            totalCartPrice += productDetail ? productDetail.totalPrice : 0;
            
                            return {
                                ...cartItem,
                                productDetails: productDetail
                            };
                        })
                    );
            
                    // Apply coupon logic---------------------------------------------
            
                    let discountedPrice = totalCartPrice;
                    if (coupon_code) {
                        try {
                            const user = await users.findOne({ where: { id: user_id } });
                            if (!user) {
                                return responseGenerator(res, "User not found", STATUSCODE.BADREQUEST, {
                                    cartItems: cartItemsWithDetails,
                                    totalCartPrice,
                                    discountedPrice,
                                    totalDiscount
                                });
                            }
                            const user_email = user.email;
            
                            const coupon = await coupons.findOne({
                                where: {
                                    coupon_code: coupon_code,
                                    expiry_date: {
                                        [Op.gte]: new Date()
                                    },
                                    status: 1
                                }
                            });
            
                            if (!coupon) {
                                return responseGenerator(res, "Coupon not found or expired", STATUSCODE.BADREQUEST, {
                                    cartItems: cartItemsWithDetails,
                                    totalCartPrice,
                                    discountedPrice,
                                    totalDiscount
                                });
                            }
            
                            const validUsers = coupon.users ? coupon.users.split(',') : [];
                            if (!validUsers.includes(user_email)) {
                                return responseGenerator(res, "Coupon not valid for this user", STATUSCODE.BADREQUEST, {
                                    cartItems: cartItemsWithDetails,
                                    totalCartPrice,
                                    discountedPrice,
                                    totalDiscount
                                });
                            }
            
                            if (coupon.coupon_uses <= 0) {
                                return responseGenerator(res, "Coupon has been used up", STATUSCODE.BADREQUEST, {
                                    cartItems: cartItemsWithDetails,
                                    totalCartPrice,
                                    discountedPrice,
                                    totalDiscount
                                });
                            }
            
                            for (const cartItem of cartItemsWithDetails) {
                                const productAttributes = await sequelize.query(
                                    `SELECT stock, price FROM products_attributes WHERE product_id = :product_id AND size = :size`,
                                    {
                                        replacements: { product_id: cartItem.productDetails.id, size: cartItem.size },
                                        type: sequelize.QueryTypes.SELECT
                                    }
                                );
                                const itemPrice = productAttributes.length > 0 ? productAttributes[0].price : null;
            
                                const validCategories = coupon.categories ? coupon.categories.split(',') : [];
                                const validBrands = coupon.brands ? coupon.brands.split(',') : [];
            
                                if (validCategories.length > 0 && !validCategories.includes(cartItem.productDetails.category_id.toString())) {
                                    return responseGenerator(res, "Coupon not valid for this category", STATUSCODE.BADREQUEST, {
                                        cartItems: cartItemsWithDetails,
                                        totalCartPrice,
                                        discountedPrice,
                                        totalDiscount
                                    });
                                }
            
                                if (validBrands.length > 0 && !validBrands.includes(cartItem.productDetails.brand_id.toString())) {
                                    return responseGenerator(res, "Coupon not valid for this brand", STATUSCODE.BADREQUEST, {
                                        cartItems: cartItemsWithDetails,
                                        totalCartPrice,
                                        discountedPrice,
                                        totalDiscount
                                    });
                                }
            
                                if (itemPrice) {
                                    if (coupon.amount_type === 'Fixed') {
                                        totalDiscount += coupon.amount;
                                    } else if (coupon.amount_type === 'Percentage') {
                                        totalDiscount += (coupon.amount / 100) * (itemPrice * cartItem.quantity);
                                    }
                                }
                            }
            
                            discountedPrice -= totalDiscount;
            
                            // coupon uses
                            await coupons.update(
                                { coupon_uses: coupon.coupon_uses - 1 },
                                { where: { id: coupon.id } }
                            );
                        } catch (error) {
                            console.error('Error occurred while applying coupon:', error);
                        }
                    }
            
                    return responseGenerator(res, "Cart items retrieved successfully", STATUSCODE.OK, {
                        cartItems: cartItemsWithDetails,
                        totalCartPrice,
                        discountedPrice,
                        totalDiscount
                    });
                } catch (error) {
                    console.error('Error occurred in viewCartItems:', error);
                    next(error);
                }
            };
            
            
            
            


       //apply coupon
 
/*
      static applyCoupon = async (req, res, next) => {
        const { user_id, coupon_code } = req.body;
    
        try {
            // Fetch cart items for the user
            const cartItems = await Carts.findAll({
                where: { user_id }
            });
    
            if (cartItems.length === 0) {
                return responseGenerator(res, "Cart is empty", STATUSCODE.BADREQUEST);
            }
    
            const user = await users.findOne({ where: { id: user_id } });
            if (!user) {
                return responseGenerator(res, "User not found", STATUSCODE.BADREQUEST);
            }
            const user_email = user.email;
    
            // Validate coupon code
            const coupon = await coupons.findOne({
                where: {
                    coupon_code: coupon_code,
                    expiry_date: {
                        [Op.gte]: new Date()
                    },
                    status: 1
                }
            });

    console.log('', coupon)

            if (!coupon) {
                return responseGenerator(res, "Invalid or expired coupon", STATUSCODE.BADREQUEST);
            }
    
            // Validate coupon applicability for user
            const validUsers = coupon.users ? coupon.users.split(',') : [];
            if (!validUsers.includes(user_email)) {
                return responseGenerator(res, "Coupon is not applicable for this user", STATUSCODE.BADREQUEST);
            }
    
            // Validate coupon applicability for products in the cart
            let applicable = true;
            let totalDiscount = 0;
    
            for (const item of cartItems) {
                const product = await Product.findByPk(item.product_id);
    
                if (!product) {
                    return responseGenerator(res, `Product with id ${item.product_id} not found`, STATUSCODE.BADREQUEST);
                }
    
                // Fetch product attributes
                const productAttributes = await sequelize.query(
                    `SELECT stock, price FROM products_attributes WHERE product_id = :product_id AND size = :size`,
                    {
                        replacements: { product_id: item.product_id, size: item.size },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
    
                if (!productAttributes || productAttributes.length === 0) {
                    return responseGenerator(res, "Product attributes not found", STATUSCODE.BADREQUEST);
                }
    
                const { category_id, brand_id, product_price } = product;
                const { quantity } = item;
                const itemPrice = productAttributes[0].price;
    
                console.log(`Product ID: ${item.product_id}, Category ID: ${category_id}, Brand ID: ${brand_id}`);
                console.log(`Valid Categories: ${coupon.categories}, Valid Brands: ${coupon.brands}`);
                console.log(`Item Quantity: ${quantity}, Item Price: ${itemPrice}, Product Price: ${product_price}`);
    
                // Validate category
                const validCategories = coupon.categories ? coupon.categories.split(',') : [];
                if (validCategories.length > 0 && !validCategories.includes(category_id.toString())) {
                    applicable = false;
                    console.log(`Category ID ${category_id} is not valid`);
                    break;
                }
    
                // Validate brand
                const validBrands = coupon.brands ? coupon.brands.split(',') : [];
                if (validBrands.length > 0 && !validBrands.includes(brand_id.toString())) {
                    applicable = false;
                    console.log(`Brand ID ${brand_id} is not valid`);
                    break;
                }
    
                // Calculate discount based on coupon type
                if (coupon.amount_type === 'Fixed') {
                    totalDiscount += coupon.amount;
                } else if (coupon.amount_type === 'Percentage') {
                    totalDiscount += (coupon.amount / 100) * (itemPrice * quantity);
                }
    
                console.log(`Calculated Discount for item: ${totalDiscount}`);
            }
    
            if (!applicable) {
                return responseGenerator(res, "Coupon is not applicable to items in the cart", STATUSCODE.BADREQUEST);
            }
    
            // Check coupon uses
            if (coupon.coupon_uses <= 0) {
                return responseGenerator(res, "Coupon has been used up", STATUSCODE.BADREQUEST);
            }
    
            // Decrement the coupon usage count
            await coupons.update(
                { coupon_uses: coupon.coupon_uses - 1 },
                { where: { id: coupon.id } }
            );
    
            // Show the discounted amount
            return responseGenerator(res, "Coupon applied successfully", STATUSCODE.OK, { discount: totalDiscount });
        } catch (error) {
            console.error('Error occurred in applyCoupon:', error);
            next(error);
        }
    };
    
        */
        
        
        
        

    static removeItemFromCart = async (req, res, next) => {
        const { user_id, product_id, size } = req.body;
    
        try {
            if (!user_id || !product_id || !size) {
                return responseGenerator(res, "User ID, Product ID, and size are required", STATUSCODE.BADREQUEST);
            }
    
            const deleted = await Carts.destroy({
                where: {
                    user_id: user_id,
                    product_id: product_id,
                    size: size,
                },
            });
    
            if (!deleted) {
                return responseGenerator(res, "Item not found in cart", STATUSCODE.NOT_FOUND);
            }
    
            return responseGenerator(res, "Item removed from cart successfully", STATUSCODE.OK);
        } catch (error) {
            
            return responseGenerator(res, "Error occurred while removing item from cart", STATUSCODE.SERVER_ERROR);
        }
    };
    

    static clearCart = async (req, res, next) => {
        const { user_id, session_id } = req.body;
        try {
            const cleared = await Carts.destroy({
                where: {
                    ...(user_id && { user_id }),
                    ...(session_id && { session_id }),
                },
            });

            if (!cleared) {
                return responseGenerator(res, "No items found in the cart", STATUSCODE.NOT_FOUND);
            }
            return responseGenerator(res, "Cart cleared successfully", STATUSCODE.OK);
        } catch (error) {
            next(error);
        }
    };
}