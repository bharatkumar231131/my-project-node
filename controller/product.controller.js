
import { Brand, Product, productImage, Rating, ratingImage, productFilter, Wishlist, Carts } from "../models/index.js";
import { dataFound, parameterNotFound, dataNotFound, otpGenerator, responseGenerator } from "../helper/function.helper.js";
import STATUSCODE from "../server/statusCode.js";
import { Op } from "sequelize";
import brands from "../models/brands.model.js";
import fs from "fs";
import path from "path";
import multer from "multer";
import { dirname } from 'path'; 
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import sequelize from "../database/init.sql.js";
import users from "../models/users.model.js";

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = path.join(__dirname, "../uploads/ratings");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    // fileFilter: (req, file, cb) => {
    //     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    //     if (allowedTypes.includes(file.mimetype)) {
    //         cb(null, true);
    //     } else {
    //         cb(new Error("Only JPEG, JPG, PNG, and GIF files are allowed"));
    //     }
    // },
}).array("images", 5);


export class ProductController {
    static getAllProduct = async (req, res, next) => {
        try {
            const image_path = 'https://123ecommerce.co.za/public/front/images/product_images/large/';
            const allproduct = await Product.findAll({
                where: {
                    deleted_at: null  
                }
            });
    
            const productIds = allproduct.map(product => product.id);
            const attributes = await sequelize.query(
                `SELECT * FROM products_attributes WHERE product_id IN (:productIds)`,
                {
                    replacements: { productIds },
                    type: sequelize.QueryTypes.SELECT
                }
            );
    
            const attributeMap = attributes.reduce((map, attr) => {
                if (!map[attr.product_id]) {
                    map[attr.product_id] = [];
                }
                map[attr.product_id].push(attr);
                return map;
            }, {});
    
            const brandIds = allproduct.map(product => product.brand_id).filter(id => id);
            const allBrands = await brands.findAll({
                where: { id: { [Op.in]: brandIds } }
            });
    
            const brandMap = allBrands.reduce((map, brand) => {
                map[brand.id] = brand;
                return map;
            }, {});
    
            const ratings = await Rating.findAll({
                where: {
                    product_id: productIds
                }
            });
    
            const ratingMap = ratings.reduce((map, rating) => {
                if (!map[rating.product_id]) {
                    map[rating.product_id] = [];
                }
                map[rating.product_id].push(rating);
                return map;
            }, {});
    
            const productsWithFullImagePath = allproduct.map(product => {
                const {
                    deleted_at,  // exclude deleted_at field
                    ...productData
                } = product.dataValues;
                const brand = brandMap[product.brand_id] || null;
                if (brand) {
                    delete brand.dataValues.deleted_at;  // exclude deleted_at field from brand
                }
                return {
                    ...productData,
                    product_image: `${image_path}${product.product_image}`,
                    brand,
                    attributes: attributeMap[product.id] || [],
                    ratings: ratingMap[product.id] || []
                };
            });
    
            return responseGenerator(res, "Product Retrieved Successfully", STATUSCODE.OK, productsWithFullImagePath);
    
        } catch (error) {
            next(error);
        }
    };
    

    
    static getProductById = async (req, res, next) => {
        const { id, user_id } = req.query;
        try {
            const image_path = 'https://123ecommerce.co.za/public/front/images/product_images/large/';
            const rating_image_path = "http://213.210.21.175:5001";
    
            const product = await Product.findOne({ where: { id: id } });
    
            if (!product) {
                return dataNotFound(product, 'Product Not Found', STATUSCODE.NOT_FOUND);
            }
    
            const brand = await Brand.findAll({ where: { id: product.brand_id } });
    
            const attributes = await sequelize.query(
                `SELECT * FROM products_attributes WHERE product_id = :productId`, 
                { replacements: { productId: product.id }, type: sequelize.QueryTypes.SELECT }
            );
    
            const ratings = await Rating.findAll({ where: { product_id: product.id } });

            const userIds = ratings.map(rating => rating.user_id);
            const user = await users.findAll({
                where: { id: userIds },
                attributes: ['id', 'name']
            });
    
            const userMap = user.reduce((map, user) => {
                map[user.id] = user.name;
                return map;
            }, {});


            const ratingImages = await ratingImage.findAll({
                where: { rating_id: ratings.map(rating => rating.id) }
            });
  
            const ratingImageMap = {};
            ratingImages.forEach(ratingImage => {
                if (!ratingImageMap[ratingImage.rating_id]) {
                    ratingImageMap[ratingImage.rating_id] = [];
                }
                ratingImageMap[ratingImage.rating_id].push(`${rating_image_path}${ratingImage.image}`);  
            });

            const averageRating = Math.round(ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length);
            const ratingCounts = {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0
            };
            ratings.forEach(rating => {
                if (rating.rating in ratingCounts) {
                    ratingCounts[rating.rating]++;
                }
            });

            const existingWishlist = await Wishlist.findOne({ where: { product_id: product.id, user_id: user_id}});
            const isWishlisted = existingWishlist !== null;

        const existingCart = await Carts.findAll({
            where:{
                product_id:id, user_id:user_id
            }
        })
         const alreadyinCart = existingCart.length > 0;
         

            let colors = [];
            if (product.group_code !== null) {
                const relatedProducts = await Product.findAll({ 
                    where: { 
                       
                             group_code: product.group_code 
                            },
                            
                });
    
                colors = relatedProducts.map(p => ({
                    color: p.product_color,
                    image: `${image_path}${p.product_image}`,
                    product_id: p.id,
                }));
            }
    
            const productWithFullImagePath = {
                ...product.dataValues,
                product_image: `${image_path}${product.product_image}`,
                brand: brand,
                attributes: attributes,
                ratings: ratings.map(rating => ({
                    ...rating.dataValues, 
                    images: ratingImageMap[rating.id] || [], 
                    name: userMap[rating.user_id]
                })),
                colors: colors,
                isWishlisted: isWishlisted,
                averageRating,
                ratingCounts,
                alreadyinCart: alreadyinCart
            };
    
            return responseGenerator(res, 'Product Fetching Successful', STATUSCODE.OK, productWithFullImagePath);
        } catch (error) {
            next(error);
        }
    };
    
    
    
    static addReviewAndRating = async (req, res, next) => {
        upload(req, res, async (err) => {
            if (err) {
                console.error("Upload error:", err); 
                return res.status(400).json({ message: err.message }); 
            }
    
            const { user_id, product_id, review, rating, status } = req.body;
    
            try {
                const newRating = await Rating.create({
                    user_id,
                    product_id,
                    review,
                    rating,
                    status,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
                 let imageRecords = [];
                if (req.files && req.files.length > 0) {
                     imageRecords = req.files.map((file) => ({
                        rating_id: newRating.id,
                        image: `/uploads/ratings/${file.filename}`,
                        status: 1,
                        created_at: new Date(),
                        updated_at: new Date(),
                    }));
                
                    await ratingImage.bulkCreate(imageRecords);
                }
    
                return res.status(200).json({ message: "Rating added successfully", data: {
                    ...newRating.dataValues,
                    images: imageRecords,
                } });
            } catch (error) {
                next(error);
            }
        });
    };
    
    
    static getReviewAndRating = async (req, res, next) => {
        const image_path = "https://123ecommerce.co.za/public/front/images/product_images/large/";
        const rating_image_path = "http://213.210.21.175:5001";
    
        try {
            const ratings = await Rating.findAll();
            const ratingsWithProducts = await Promise.all(
                ratings.map(async (rating) => {
                    const product = await Product.findOne({ where: { id: rating.product_id } });
                    const ratingImages = await ratingImage.findAll({ where: { rating_id: rating.id } });
    
                    const rating_images = ratingImages.map((img) => ({
                        id: img.id,
                        rating_image: `${rating_image_path}${img.image}`,  
                    }));
    
                    return {
                        ...rating.dataValues,
                        product: product
                            ? {
                                  ...product.dataValues,
                                  product_image: `${image_path}${product.product_image}`,
                              }
                            : null,
                        rating_images,
                    };
                })
            );
    
            return responseGenerator(res, 'Rating Fetch Successful', STATUSCODE.OK, ratingsWithProducts);
        } catch (error) {
            next(error);
        }
    };
    

    

    static getReviewAndRatingById = async (req, res, next) => {
        const image_path = "https://123ecommerce.co.za/public/front/images/product_images/large/";
        const rating_image_path = "http://213.210.21.175:5001";
    
        const { id } = req.query;
        try {
            const ratings = await Rating.findAll({ where: { user_id: id, deleted_at: null} });
            const ratingsWithDetails = await Promise.all(
                ratings.map(async (rating) => {
                    const product = await Product.findOne({ where: { id: rating.product_id } });
    
                    const ratingImages = await ratingImage.findAll({ where: { rating_id: rating.id } });
    
                    const rating_images = ratingImages.map((img) => ({
                        id: img.id,
                        rating_image: `${rating_image_path}${img.image}`,  
                    }));
    
                    return {
                        ...rating.dataValues,
                        product: product
                            ? {
                                  ...product.dataValues,
                                  product_image: `${image_path}${product.product_image}`,
                              }
                            : null,
                        rating_images,
                    };
                })
            );
    
            return responseGenerator(res, 'Rating Fetch Successful', STATUSCODE.OK, ratingsWithDetails);
        } catch (error) {
            next(error);
        }
    };


    
    static getHomeProducts = async (req, res, next) => {
        try {
            const image_path = 'https://123ecommerce.co.za/public/front/images/product_images/large/';
            const { page = 1, limit = 6, user_id } = req.query;  
    
            const offset = (page - 1) * limit;
    
            // Fetch products with pagination
            const fetchProducts = (condition) => {
                return Product.findAndCountAll({
                    where: { ...condition, deleted_at: null },
                    limit,
                    offset
                });
            };
    
            const [featuredProducts, bestsellerProducts, newArrivals, hotDeals] = await Promise.all([
                fetchProducts({ is_featured: 'Yes' }),
                fetchProducts({ is_bestseller: 'Yes' }),
                fetchProducts({
                    created_at: { [Op.gte]: new Date(new Date() - 5 * 24 * 60 * 60 * 1000) }
                }),
                fetchProducts({ product_discount: { [Op.gt]: 5 } })  // More than 5% discount
            ]);

            const allProducts = [...featuredProducts.rows, ...bestsellerProducts.rows, ...newArrivals.rows, ...hotDeals.rows];
            const productIds = allProducts.map(product => product.id);
    
            // Fetch ratings
            const ratings = await Rating.findAll({
                attributes: ['product_id', 'rating'],
                where: { product_id: { [Op.in]: productIds } },
                raw: true
            });
    
            const ratingMap = ratings.reduce((map, rating) => {
                if (!map[rating.product_id]) {
                    map[rating.product_id] = [];
                }
                map[rating.product_id].push(rating.rating);
                return map;
            }, {});
    
            const averageRatingsMap = {};
            productIds.forEach(productId => {
                const productRatings = ratingMap[productId] || [];
                const averageRating = productRatings.length > 0
                    ? (productRatings.reduce((sum, rating) => sum + rating, 0) / productRatings.length)
                    : 0;
                averageRatingsMap[productId] = averageRating;
            });
    
            // Fetch user's wishlist and cart
            const [wishlist, cart] = await Promise.all([
                Wishlist.findAll({ where: { user_id, status: 1 }, raw: true }),
                Carts.findAll({ where:{  user_id  }})
            ]);
     
            const wishlistProductIds = wishlist.map(item => String(item.product_id));
         
            const cartProductIds = cart.map(item => item.product_id);
                     
          
    
            const mapProductDetails = (products) => {
                return products.map(product => ({
                    ...product.dataValues,
                    product_image: `${image_path}${product.product_image}`,
                    averageRating: averageRatingsMap[product.id],
                    isWishlisted: wishlistProductIds.includes(String(product.id)),
                    isInCart: cartProductIds.includes(product.id)
                }));
            };
    
            const response = {
                featured: {
                    products: mapProductDetails(featuredProducts.rows),
                    total: featuredProducts.count,
                    totalPages: Math.ceil(featuredProducts.count / limit),
                    currentPage: page
                },
                bestseller: {
                    products: mapProductDetails(bestsellerProducts.rows),
                    total: bestsellerProducts.count,
                    totalPages: Math.ceil(bestsellerProducts.count / limit),
                    currentPage: page
                },
                newArrivals: {
                    products: mapProductDetails(newArrivals.rows),
                    total: newArrivals.count,
                    totalPages: Math.ceil(newArrivals.count / limit),
                    currentPage: page
                },
                hotDeals: {
                    products: mapProductDetails(hotDeals.rows),
                    total: hotDeals.count,
                    totalPages: Math.ceil(hotDeals.count / limit),
                    currentPage: page
                }
            };
    
            return responseGenerator(res, "Home Products Retrieved Successfully", STATUSCODE.OK, response);
    
        } catch (error) {
            next(error);
        }
    };
    
    

    static async getProductByCategory(req, res, next) {
        const { category_id, user_id, sort, color, brand, size, min_price, max_price } = req.query; 
        const image_path = 'https://123ecommerce.co.za/public/front/images/product_images/large/';
    
        try {
            const whereConditions = {
                category_id,
                deleted_at: null
            };
    
            // Filter by colors
            if (color) {
                const colorsArray = color.split(',').map(c => c.trim());
                if (colorsArray.length > 0) {
                    whereConditions.product_color = {
                        [Op.in]: colorsArray
                    };
                }
            }
    
            // Filter by brands
            if (brand) {
                const brandsArray = brand.split(',').map(b => b.trim());
                const brandIds = await Brand.findAll({
                    where: {
                        name: {
                            [Op.in]: brandsArray
                        }
                    },
                    attributes: ['id']
                });
                if (brandIds.length > 0) {
                    whereConditions.brand_id = {
                        [Op.in]: brandIds.map(brand => brand.id)
                    };
                }
            }
    
            // Filter by price range
            if (min_price && max_price) {
                whereConditions.product_price = {
                    [Op.between]: [parseFloat(min_price), parseFloat(max_price)]
                };
            }
    
            let products = await Product.findAll({
                where: whereConditions
            });
    
            if (products.length === 0) {
                return responseGenerator(res, "No Products Found for the given category", STATUSCODE.OK, []);
            }
    
            const productIds = products.map(product => product.id);
    
            const attributes = await sequelize.query(
                `SELECT * FROM products_attributes WHERE product_id IN (:productIds)`,
                {
                    replacements: { productIds },
                    type: sequelize.QueryTypes.SELECT
                }
            );
    
            const attributeMap = {};
            attributes.forEach(attr => {
                if (!attributeMap[attr.product_id]) {
                    attributeMap[attr.product_id] = [];
                }
                attributeMap[attr.product_id].push(attr);
            });
    
            // Filter by sizes
            if (size) {
                const sizesArray = size.split(',').map(s => s.trim());
                const productAttributes = await sequelize.query(
                    `SELECT pa.product_id 
                     FROM products_attributes pa
                     WHERE pa.size IN (:sizes)`,
                    {
                        replacements: { sizes: sizesArray },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
                const filteredProductIdsBySize = productAttributes.map(item => item.product_id);
              products = products.filter(product => filteredProductIdsBySize.includes(product.id));
            }
    
            // Fetch brands
            const brandIds = products.map(product => product.brand_id).filter(id => id);
            const allBrands = await Brand.findAll({
                where: { id: { [Op.in]: brandIds } }
            });
    
            const brandMap = {};
            allBrands.forEach(brand => {
                brandMap[brand.id] = brand;
            });
    
            // Fetch ratings
            const ratings = await Rating.findAll({
                attributes: ['id', 'user_id', 'product_id', 'rating', 'review'],
                where: {
                    product_id: productIds
                }
            });
    
            const ratingMap = ratings.reduce((map, rating) => {
                if (!map[rating.product_id]) {
                    map[rating.product_id] = [];
                }
                map[rating.product_id].push(rating);
                return map;
            }, {});
    
            // Calculate average ratings and map to products
            const averageRatingsMap = {};
            products.forEach(product => {
                const productRatings = ratingMap[product.id] || [];
                const averageRating = productRatings.length > 0
                    ? Math.round(productRatings.reduce((sum, rating) => sum + rating.rating, 0) / productRatings.length)
                    : 0;
                averageRatingsMap[product.id] = averageRating;
            });
    
            // Fetch user's wishlist
            const wishlist = await Wishlist.findAll({
                where: { user_id, status: 1 },
                raw: true
            });
    
            const wishlistProductIds = wishlist.map(item => item.product_id);
            
            // Map data to products
            const productsWithFullImagePath = products.map(product => {
                const {
                    deleted_at,
                    ...productData
                } = product.dataValues;
    
                const brand = brandMap[product.brand_id] || null;
                if (brand) {
                    delete brand.dataValues.deleted_at;
                }
    
                const productRatings = ratingMap[product.id] || [];
    
                const isWishlisted = wishlistProductIds.map(String).includes(String(product.id));
    
                return {
                    ...productData,
                    product_image: `${image_path}${product.product_image}`,
                    brand,
                    attributes: attributeMap[product.id] || [],
                    ratings: productRatings,
                    averageRating: averageRatingsMap[product.id],
                    isWishlisted
                };
            });
    
            // Sorting logic
            switch(sort) {
                case 'newest':
                    productsWithFullImagePath.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case 'popular':
                    productsWithFullImagePath.sort((a, b) => b.averageRating - a.averageRating);
                    break;
                case 'price_highest':
                    productsWithFullImagePath.sort((a, b) => b.product_price - a.product_price);
                    break;
                case 'price_lowest':
                    productsWithFullImagePath.sort((a, b) => a.product_price - b.product_price);
                    break;
                default:
                    break;
            }
    
            return responseGenerator(res, "Products Retrieved Successfully", STATUSCODE.OK, productsWithFullImagePath);
    
        } catch (error) {
            next(error);
        }
    }
    
    
    
  

// filters and get filters
static getFiltersByCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.query;
 
        // Fetch products for the given category
        const products = await Product.findAll({
            where: {
                category_id: categoryId,
                deleted_at: null
            },
            attributes: [
                'id',
                'product_color',
                'brand_id',
                'product_price'
            ]
        });

        // Extract distinct colors, filtering out null values
        const colors = [...new Set(products.map(product => product.product_color).filter(color => color !== null))];

        // Fetch distinct brand names using brand IDs
        const brandIds = [...new Set(products.map(product => product.brand_id))];
        const brands = await Brand.findAll({
            where: {
                id: brandIds
            },
            attributes: ['name']
        });

        const brandNames = brands.map(brand => brand.name);

        // Extract product IDs
        const productIds = products.map(product => product.id);

        const sizes = await sequelize.query(
            `SELECT DISTINCT size 
             FROM products_attributes 
             WHERE product_id IN (:productIds)`,
            {
                replacements: { productIds },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Calculate price range
        const prices = products.map(product => product.product_price);
        const priceRange = {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };

        // Combine filters
        const filters = {
            colors,
            brands: brandNames,
            sizes: sizes.map(item => item.size),
            priceRange
        };

        return responseGenerator(res, "Filters Retrieved Successfully", STATUSCODE.OK, filters);

    } catch (error) {
        next(error);
    }
};

///////not to use now///////////
static async getFilteredProducts(req, res, next) {
    try {
        const { categoryId } = req.query;
        const { colors, brands, sizes, minPrice, maxPrice } = req.body;

        

        const image_path = 'https://123ecommerce.co.za/public/front/images/product_images/large/';

        const whereConditions = {
            category_id: categoryId,
            deleted_at: null
        };

        // Filter by colors
        if (colors && colors.trim().length) {
            whereConditions.product_color = {
                [Op.in]: colors.trim().split(/\s+/)
            };
        }

        // Filter by brands
        if (brands && brands.trim().length) {
            const brandIds = await Brand.findAll({
                where: {
                    name: {
                        [Op.in]: brands.trim().split(',')
                    }
                },
                attributes: ['id']
            }).then(brands => brands.map(brand => brand.id));
            if (brandIds.length) {
                whereConditions.brand_id = {
                    [Op.in]: brandIds
                };
            }
        }

        // Filter by price range
        if (minPrice && minPrice.trim().length && maxPrice && maxPrice.trim().length) {
            whereConditions.product_price = {
                [Op.gt]: parseFloat(minPrice),
                [Op.lt]: parseFloat(maxPrice)
            };
        }

        // Filter by sizes
        if (sizes && sizes.trim().length) {
            const productAttributes = await sequelize.query(
                `SELECT pa.product_id 
                 FROM products_attributes pa
                 WHERE pa.size IN (:sizes)`,
                {
                    replacements: { sizes: sizes.trim().split(',') },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            const productIds = productAttributes.map(item => item.product_id);
            if (productIds.length) {
                whereConditions.id = {
                    [Op.in]: productIds
                };
            }
        }


        const finalFilteredProducts = await Product.findAll({
            where: whereConditions,
            attributes: [
                'id',
                'product_color',
                'brand_id',
                'product_price',
                'name', 
            ]
        });

        // Fetch attributes, brands, and ratings for the filtered products
        const productIds = finalFilteredProducts.map(product => product.id);
        const attributes = await sequelize.query(
            `SELECT * FROM products_attributes WHERE product_id IN (:productIds)`,
            {
                replacements: { productIds },
                type: sequelize.QueryTypes.SELECT
            }
        );

        const attributeMap = {};
        attributes.forEach(attr => {
            if (!attributeMap[attr.product_id]) {
                attributeMap[attr.product_id] = [];
            }
            attributeMap[attr.product_id].push(attr);
        });

        const brandIds = finalFilteredProducts.map(product => product.brand_id).filter(id => id);
        const allBrands = await Brand.findAll({
            where: { id: { [Op.in]: brandIds } }
        });

        const brandMap = {};
        allBrands.forEach(brand => {
            brandMap[brand.id] = brand;
        });

        const ratings = await Rating.findAll({
            where: {
                product_id: productIds
            }
        });

        const ratingMap = {};
        ratings.forEach(rating => {
            if (!ratingMap[rating.product_id]) {
                ratingMap[rating.product_id] = [];
            }
            ratingMap[rating.product_id].push(rating);
        });

        const productsWithFullDetails = finalFilteredProducts.map(product => {
            const {
                deleted_at,  // exclude deleted_at field
                ...productData
            } = product.dataValues;
            const brand = brandMap[product.brand_id] || null;
            if (brand) {
                delete brand.dataValues.deleted_at;  // exclude deleted_at field from brand
            }
            return {
                ...productData,
                product_image: `${image_path}${product.product_image}`,
                brand,
                attributes: attributeMap[product.id] || [],
                ratings: ratingMap[product.id] || []
            };
        });

        return responseGenerator(res, "Products Retrieved Successfully", STATUSCODE.OK, productsWithFullDetails);

    } catch (error) {
        console.error('Error:', error.message, error.stack);
        next(error);
    }
}
};