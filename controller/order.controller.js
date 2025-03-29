
import { deliveryAddresses, Orders, Product, returnOrders, User, Carts, companyAddresses, orderProduct } from "../models/index.js";
import { dataFound, parameterNotFound, dataNotFound, otpGenerator, responseGenerator } from "../helper/function.helper.js";
import STATUSCODE from "../server/statusCode.js";
import sequelize from "../database/init.sql.js";
import { Op, where } from "sequelize";
import axios from "axios";
import orders from "../models/orders.model.js";




export class OrderController {

    static chooseDeliveryType = async (req, res, next) => {
        const { order_id, delivery_option } = req.body;
        try {
            const order = await Orders.findByPk(order_id);
            if (!order) { return responseGenerator(res, "Order not found", STATUSCODE.NOT_FOUND); }
            await order.update({ delivery_option });
            return responseGenerator(res, "Delivery option updated successfully", STATUSCODE.OK, order);
        } catch (error) {
            next(error);
        }
    };

    static getAllOrdersForUser = async (req, res, next) => {
        const { user_id, status } = req.query;
    
        if (!user_id || !status) {
            return responseGenerator(res, "User ID and status are required", STATUSCODE.BADREQUEST);
        }
    
        try {
            let statuses = [];
            switch (status) {
                case "Delivered":
                    statuses = ["Delivered"];
                    break;
                case "Processing":
                    statuses = ["In Progress", "Pending", "New", "Paid","","processing","Shipped"];
                    break;
                case "Canceled":
                    statuses = ["Canceled"];
                    break;
                default:
                    return responseGenerator(res, "Invalid status", STATUSCODE.BADREQUEST);
            }
    
            const userOrders = await orders.findAll({ where: { user_id: user_id, order_status: statuses } });

            
    
            if (userOrders.length === 0) {
                return responseGenerator(res, "no order found" , STATUSCODE.OK,[]);
            }
    
            const orderIds = userOrders.map(order => order.id);
            const orderProducts = await orderProduct.findAll({ where: { order_id: orderIds } });
    
            const orderQuantities = orderProducts.reduce((acc, product) => {
                if (!acc[product.order_id]) {
                    acc[product.order_id] = 0;
                }
                acc[product.order_id] += product.product_qty;
                return acc;
            }, {});
    
            const formattedOrders = userOrders.map(order => ({
                order_number: order.id,
                date: order.created_at,
                tracking_number: order.tracking_number || "N/A",
                total_amount: order.grand_total,
                quantity: orderQuantities[order.id] || 0,
                status: order.order_status,
            }));
    
            return responseGenerator(res, `${status} orders retrieved successfully`, STATUSCODE.OK, { orders: formattedOrders });
        } catch (error) {
            return responseGenerator(res, "Error retrieving orders", STATUSCODE.SERVER_ERROR);
        }
    };
    


    static getOrderDetailsById = async (req, res, next) => {
        const { order_id } = req.query;
        const image_path = 'https://123ecommerce.co.za/public/front/images/product_images/large/';
        try {
          
            const order = await orders.findByPk(order_id);
            if (!order) {
                return responseGenerator(res, "Order not found", STATUSCODE.NOT_FOUND);
            }
    
            // Fetch product details from orders_products table
            const orderProducts = await orderProduct.findAll({
                where: { order_id }
            });
    
            // Fetch product images from products table using the product IDs
            const productIds = orderProducts.map(op => op.product_id);
            const productImages = await Product.findAll({
                where: {
                    id: productIds
                },
                attributes: ['id', 'product_image'] 
            });
    
            //map for images
            const productImageMap = {};
            productImages.forEach(product => {
                productImageMap[product.id] = `${image_path}${product.product_image}`;
            });
    
            // Combine details
            const orderDetails = {
                ...order.get({ plain: true }),
                products: orderProducts.map(orderProduct => ({
                    ...orderProduct.get({ plain: true }),
                    image_url: productImageMap[orderProduct.product_id]
                }))
            };
    
            return responseGenerator(res, "Order details retrieved successfully", STATUSCODE.OK, orderDetails);
        } catch (error) {
            next(error);
        }
    };
    
    


    

    // static getOrderDetailsById = async (req, res, next) => {
    //     const { order_id } = req.query;
    //     try {
    //         const order = await orders.findByPk(order_id);
    //         if (!order) {
    //             return responseGenerator(res, "Order not found", STATUSCODE.NOT_FOUND);
    //         }
    //         return responseGenerator(res, "Order details retrieved successfully", STATUSCODE.OK, order);
    //     } catch (error) {
    //         next(error);
    //     }
    // };
    static createOrder = async (req, res, next) => {
        const {
            user_id, shipping_id, delivery_id, delivery_option, shipping_charges, coupon_code, coupon_amount, order_status, payment_method, payment_gateway, grand_total, courier_name, tracking_number, is_pushed
        } = req.body;
    
        try {
            const user = await User.findByPk(user_id);
            if (!user) {
                return responseGenerator(res, "User not found", STATUSCODE.NOT_FOUND);
            }

            const deliveryData = await deliveryAddresses.findOne({ where: { Id: delivery_id } });
            if (!deliveryData) {
            return responseGenerator(res, "delivery address not found",STATUSCODE.NOT_FOUND);
        }
            
            const cartItems = await Carts.findAll({
                where: { user_id }
            });
            console.log('',cartItems);
    
            if (!cartItems || cartItems.length === 0) {
                return responseGenerator(res, "No items in cart", STATUSCODE.BADREQUEST);
            }
    
            // Create a new order
            const newOrder = await orders.create({
                user_id, shipping_id, name:deliveryData.name, address:deliveryData.address, city:deliveryData.city, state:deliveryData.state, country:deliveryData.country, pincode:deliveryData.pincode, mobile:deliveryData.mobile, email: user.email, delivery_option, shipping_charges, order_status, payment_method, coupon_code, coupon_amount, payment_gateway, grand_total, courier_name, tracking_number, is_pushed, created_at: new Date(), updated_at: new Date()
            });
    
            // product ids from cart
            const productIds = cartItems.map(item => item.product_id);
    
            // Fetch product attributes 
            const attributes = await sequelize.query(
                `SELECT * FROM products_attributes WHERE product_id IN (:productIds)`,
                {
                    replacements: { productIds },
                    type: sequelize.QueryTypes.SELECT
                }
            );
    
          
    
            // for productOrders
            for (const item of cartItems) {
                const product = await Product.findByPk(item.product_id); 
                const productAttribute = attributes.find(attr => attr.product_id === item.product_id && attr.size === item.size);
    
                if (!productAttribute) {
        
                    return responseGenerator(res, "Product attribute not found", STATUSCODE.BADREQUEST);
                }
    
                await orderProduct.create({
                    order_id: newOrder.id, user_id, product_id: item.product_id, product_name: product.product_name, product_code: product.product_code, product_color: product.product_color, product_size: item.size, product_price: productAttribute.price, product_qty: item.quantity
                });
    
                // cart destroy after order
                await Carts.destroy({ where: { id: item.id } });
            }
    
            return responseGenerator(res, "Order created successfully", STATUSCODE.CREATED, newOrder);
        } catch (error) {
            next(error);
        }    
    }
    
    
    

    static orderSummery = async (req, res, next) => {
        try {
            const { user_id, product_id, delivery_id } = req.body;
            const product = await Product.findAll({ where: { user_id: user_id, product_id: product_id } })
            const deliveryAddresse = await deliveryAddresses.findOne({ where: { id: delivery_id, user_id: user_id } })
            const companyAddresse = companyAddresses.findOne()
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            // const obj = { collection_address: companyAddresse[0], delivery_address: deliveryAddresse };

            const obj = {
                collection_address: {
                type: "buisness",
                    company: companyAddresse.company_name,
                    street_address:companyAddresse.address,
                    local_area: "",
                    city: companyAddresse.city,
                    zone: companyAddresse.state,
                    country: companyAddresse.country,
                    code: companyAddresse.pincode,
                    lat: -25.7863272,
                    lng: 28.277583
                },
                delivery_address: {
                    type: "residential",
                    company: "",
                    street_address: deliveryAddresse.address,
                    local_area: "",
                    city: deliveryAddresse.city,
                    zone: deliveryAddresse.state,
                    country: deliveryAddresse.country,
                    code: deliveryAddresse.pincode,
                    lat: "",
                    lng: ""
                },
                parcels: [
                    {
                        submitted_length_cm: product.product_length,
                        submitted_width_cm: product.product_width,
                        submitted_height_cm: product.product_height,
                        submitted_weight_kg: product.product_weight
                    }
                ],
            }

            const raw = JSON.stringify({
                "collection_address": {
                    "type": "business",
                    "company": "uAfrica.com",
                    "street_address": "32 Gainsford Place",
                    "local_area": "Menlyn",
                    "city": "La Lucia",
                    "zone": "Gauteng",
                    "country": "ZA",
                    "code": "4051",
                    "lat": -25.7863272,
                    "lng": 28.277583
                },
                "delivery_address": {
                    "type": "residential",
                    "company": "",
                    "street_address": "104, vallue view road, queensborough",
                    "local_area": "Olympus AH",
                    "city": "Pretoria",
                    "zone": "Gauteng",
                    "country": "ZA",
                    "code": "4051",
                    "lat": -25.80665579999999,
                    "lng": 28.334732
                },
                "parcels": [
                    {
                        "submitted_length_cm": 42.5,
                        "submitted_width_cm": 38.5,
                        "submitted_height_cm": 5.5,
                        "submitted_weight_kg": 3
                    }
                ],
                // "declared_value": 1500,
                // "collection_min_date": "2021-05-21",
                // "delivery_min_date": "2021-05-21"
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("https://api.shiplogic.com/v2/rates", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
        } catch (error) {
            next(error);
        }
    };

    static submitReturnRequest = async (req, res, next) => {
        const { user_id, order_id, product_ids, return_reason, tracking_number } = req.body;
    
        try {
            if (!user_id || !order_id || !product_ids || !return_reason) {
                return responseGenerator(
                    res,
                    "Missing required fields: user_id, order_id, product_ids, return_reason",
                    STATUSCODE.NOT_FOUND
                );
            }
    
            // Convert the product_ids array to a JSON string
            const productIdsJson = JSON.stringify(product_ids);
    
            // Create a new return order with the product IDs as a JSON string
            const newReturnOrder = await returnOrders.create({
                user_id,
                order_id,
                product_id: productIdsJson,
                return_reason,
                tracking_number: tracking_number || null,
                status: false,
                created_at: new Date(),
                updated_at: new Date(),
            });
    


            return responseGenerator(
                res,
                "Return order submitted successfully",
                STATUSCODE.OK,
                newReturnOrder
            );
    
        } catch (error) {
           
            return responseGenerator(
                res,
                "Error processing return request",
                STATUSCODE.SERVER_ERROR
            );
        }
    };
    
    

    static addDeliveryAddress = async (req, res, next) => {
        try {
            const { user_id,name, address, city, state, country, pincode, mobile, status,type } = req.body;
           
            const [newAddress, created] = await deliveryAddresses.findOrCreate({
                where: { 
                    user_id, 
                    address, 
                    city, 
                    pincode 
                },
                defaults: {
                    name,
                    state,
                    country,
                    mobile,
                    status,
                    type,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            });

            return responseGenerator(res, "Address Add successfully", STATUSCODE.OK, newAddress);

        } catch (error) {
            next(error)
        }
    };

    static editDeliveryAddress = async (req, res, next) => {
        try {
            const { address_id } = req.query; 
            const { user_id, name, address, city, state, country, pincode, mobile, status, type } = req.body;
    
            
            const addressRecord = await deliveryAddresses.findOne({
                where: {
                    id: address_id,
                    user_id: user_id  
                }
            });
    
            
            if (!addressRecord) {
                return responseGenerator(res, "Address not found", STATUSCODE.NOT_FOUND, null);
            }
    
            // Update the address with new details
            addressRecord.name = name;
            addressRecord.address = address;
            addressRecord.city = city;
            addressRecord.state = state;
            addressRecord.country = country;
            addressRecord.pincode = pincode;
            addressRecord.mobile = mobile;
            addressRecord.status = status;
            addressRecord.type = type;
            addressRecord.updated_at = new Date();  // Update the timestamp
    
            await addressRecord.save();
    
            return responseGenerator(res, "Address updated successfully", STATUSCODE.OK, addressRecord);
    
        } catch (error) {
            next(error);
        }
    };
    






    static getDeliveryAddress = async (req, res, next) => {
        try {
            const { user_id } = req.query;
            const address = await deliveryAddresses.findAll({ where: { user_id: user_id } })

            if (address.length > 0) {
                return responseGenerator(res, "Address Fetch Successfully", STATUSCODE.OK, address)
            } else {
                return responseGenerator(res, "No Address Found", STATUSCODE.NOT_FOUND)
            }
        } catch (error) {
            next(error);
        }
    };




///////////////////////////////////////////// testing for profile ///////////////////////////////////////



static profile = async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return responseGenerator(res, "User ID and status are required", 400);
    }

    try {

        const user = await User.findOne({ where: { id:user_id } });
        const profile = { user_id };
 
        // Fetch orders
        profile.orders = await getAllOrdersForUser(user_id);

        // Fetch reviews and ratings
        profile.reviews_and_ratings = await getReviewsAndRatingsById(user_id);

        // Fetch delivery addresses
        profile.addresses = await getDeliveryAddress(user_id);

       

        return responseGenerator(res, "Profile fetched successfully", 200, {user, profile});
    } catch (error) {
        console.error("Error fetching profile:", error);
        return responseGenerator(res, error.message, 500);
    }
}


}