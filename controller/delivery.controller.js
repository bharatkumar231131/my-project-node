import axios from "axios";
const baseURL = process.env.SHIP_LOGIC_BASE_URL;
const apiKey = process.env.SHIP_LOGIC_API_KEY;
import company_addresses from "../models/company_addresses.model.js";
import products from "../models/products.model.js";
import delivery_addresses from "../models/delivery_addresses.model.js";
 import orders from "../models/orders.model.js";
import users from "../models/users.model.js";
import return_orders from "../models/return_orders.model.js";
import STATUSCODE from "../server/statusCode.js";
import { dataFound,parameterNotFound, dataNotFound, otpGenerator, responseGenerator } from "../helper/function.helper.js";


const shipLogicAPI = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    }
});



export class deliveryController {
    
static async calculateRate(req, res) {
    try {
        const { company_Id, delivery_Id, product_Id } = req.body;

        if (!company_Id || !delivery_Id || !product_Id) {
            return responseGenerator(res, "Missing required IDs in the request body", STATUSCODE.BADREQUEST, null);
        }

        const collectionData = await company_addresses.findOne({ where: { Id: company_Id } });
        if (!collectionData) {
            return responseGenerator(res, 'Collection address not found', STATUSCODE.NOT_FOUND, null);
        }

        const deliveryData = await delivery_addresses.findOne({ where: { Id: delivery_Id } });
        if (!deliveryData) {
            return responseGenerator(res, 'Delivery address not found', STATUSCODE.NOT_FOUND, null);
        }

        const productData = await products.findAll({ where: { Id: product_Id } });
        if (!productData.length) {
            return responseGenerator(res, 'Products not found', STATUSCODE.NOT_FOUND, null);
        }

        const payload = {
            collection_address: {
                type: "business",
                company: collectionData.company_name,
                street_address: collectionData.address,
                city: collectionData.city,
                country: collectionData.country,
                code: (collectionData.pincode).toString(),
            },
            delivery_address: {
                type: "residential",
                company: "",
                street_address: deliveryData.address,
                city: deliveryData.city,
                country: deliveryData.country,
                code: (deliveryData.pincode).toString(),
            },
            parcels: productData.map(products => ({
                submitted_length_cm: products.product_length,
                submitted_width_cm: products.product_width,
                submitted_height_cm: products.product_height,
                submitted_weight_kg: products.product_weight
            })),
            declared_value: 0,
        };

        const payloadString = JSON.stringify(payload);

        const response = await shipLogicAPI.post("/rates", payloadString);
        return responseGenerator(res, "Charges retrieved", STATUSCODE.OK, response.data);
    } catch (error) {
        return responseGenerator(res, error.response?.data || error.message, STATUSCODE.SERVER_ERROR, null);
    }
}


// crete shipment for shipping_id and track refrence saving in order 



static async createShippingOrder(req, res) {
    try {
        const { company_Id, delivery_Id, product_Id, user_Id, order_Id, service_level_code } = req.body;
        
        if (!company_Id || !delivery_Id || !product_Id || !user_Id || !order_Id) {
            return responseGenerator(res, "Missing required IDs in the request body", STATUSCODE.BADREQUEST, null);
        }

        const collectionData = await company_addresses.findOne({ where: { Id: company_Id } });
        if (!collectionData) {
            return responseGenerator(res, 'Collection address not found', STATUSCODE.NOT_FOUND, null);
        }

        const deliveryData = await delivery_addresses.findOne({ where: { Id: delivery_Id } });
        if (!deliveryData) {
            return responseGenerator(res, 'Delivery address not found', STATUSCODE.NOT_FOUND, null);
        }

        const productData = await products.findAll({ where: { Id: product_Id } });
        if (!productData.length) {
            return responseGenerator(res, 'Products not found', STATUSCODE.NOT_FOUND, null);
        }

        const userData = await users.findOne({ where: { Id: user_Id } });
        if (!userData) {
            return responseGenerator(res, 'User not found', STATUSCODE.NOT_FOUND, null);
        }

        const orderData = await orders.findOne({ where: { Id: order_Id } });
        if (!orderData) {
            return responseGenerator(res, 'Order not found', STATUSCODE.NOT_FOUND, null);
        }

        const currentDate = new Date();
        const deliveryDate = new Date(currentDate);
        deliveryDate.setDate(deliveryDate.getDate() + 3);

        const payload = {
            collection_address: {
                type: "business",
                company: collectionData.company_name,
                street_address: collectionData.address,
                city: collectionData.city,
                country: collectionData.country,
                code: (collectionData.pincode).toString(),
            },
            collection_contact: {
                name: collectionData.company_name,
                mobile_number: collectionData.mobile_number,
                email: collectionData.company_email,
            },
            delivery_address: {
                type: "residential",
                company: "",
                street_address: deliveryData.address,
                city: deliveryData.city,
                country: deliveryData.country,
                code: (deliveryData.pincode).toString(),
            },
            delivery_contact: {
                name: deliveryData.name,
                mobile_number: deliveryData.mobile,
                email: userData.email,
            },
            parcels: productData.map(products => ({
                submitted_length_cm: products.product_length,
                submitted_width_cm: products.product_width,
                submitted_height_cm: products.product_height,
                submitted_weight_kg: products.product_weight
            })),
            special_instructions_collection: "This is a test shipment - DO NOT COLLECT",
            special_instructions_delivery: "This is a test shipment - DO NOT DELIVER",
            declared_value: 1100,
            collection_min_date: currentDate.toISOString(),
            collection_after: "08:00",
            collection_before: "16:00",
            delivery_min_date: deliveryDate.toISOString(),
            delivery_after: "10:00",
            delivery_before: "17:00",
            custom_tracking_reference: "",
            customer_reference: orderData.tracking_number,
            service_level_code: service_level_code,
            mute_notifications: false
        };

        const response = await shipLogicAPI.post("/shipments", payload);

        //saving shipping_id in order_id
        await orders.update({ shipping_id: response.data.id }, { where: { Id: order_Id } });
        await orders.update({ tracking_number: response.data.short_tracking_reference }, { where: { id: order_Id } });
        await orders.update({service_level_code:response.data.service_level_code}, {where: { id: order_Id } })


        return responseGenerator(res, "Shipment created successfully", STATUSCODE.CREATED, response.data);
    } catch (error) {
        return responseGenerator(res, error.response?.data || error.message, STATUSCODE.SERVER_ERROR, null);
    }
}

             //tracking

    static async trackOrder(req, res) {
        try {
            const { order_id} = req.query
            if (!order_id) {
                return responseGenerator(res, 'missing order id ', STATUSCODE.BADREQUEST, null);
            }
            const orderData = await orders.findOne({ where: { Id: order_id } });
            if (!orderData) {
                return responseGenerator(res, 'order not found', STATUSCODE.NOT_FOUND, null);
            }

            const tracking_reference = orderData.tracking_number;

            const response = await shipLogicAPI.get(`tracking/shipments?tracking_reference=${tracking_reference}`);

            return responseGenerator(res, "tracking data retiriived", STATUSCODE.OK, response.data);
        } catch (error) {
            return responseGenerator(res, error.response?.data || error.message, STATUSCODE.SERVER_ERROR, null);
        }
    }

                  //cancelling

    static async cancelOrder(req, res) {
        try {
            const { order_id } = req.body; 
            
            if (!order_id) {
                return responseGenerator(res, 'missing order id ', STATUSCODE.BADREQUEST, null);
            }
    
            const orderData = await orders.findOne({ where: { Id: order_id } });
            if (!orderData) {
                return responseGenerator(res, 'order not found', STATUSCODE.NOT_FOUND, null);
            }
    
            const trackingReference = orderData.tracking_number;
            const response = await shipLogicAPI.post("/shipments/cancel", { tracking_reference: trackingReference });
    
            return responseGenerator(res, "order data recieved", STATUSCODE.OK, response.data);
        } catch (error) {
            console.error("Error during order cancellation:", error.message);
            return responseGenerator(res, error.response?.data || error.message, STATUSCODE.SERVER_ERROR, null);
        }
    }
 
       // shipping lable 

    static async getShippingLabel(req, res) {
        try {
            const { id } = req.query; // order id
            if (!id) {
                return responseGenerator(res, 'Missing order id ', STATUSCODE.BADREQUEST, null);
            }
            const order = await orders.findByPk(id);
            if (!order) {
                return responseGenerator(res, 'order not found', STATUSCODE.NOT_FOUND, null);
            }
            const shippingId = order.shipping_id;
            if (!shippingId) {
                return res.status(400).json({ error: "Missing shipping ID in the order" });
            }
            const response = await shipLogicAPI.get(`/shipments/label?id=${shippingId}`);
            
            
            return responseGenerator(res, "shipping label retrived", STATUSCODE.OK, response.data);
        } catch (error) {
            return responseGenerator(res, error.response?.data || error.message, STATUSCODE.SERVER_ERROR, null);
        }
    }

                   //shipping sticker


static async getShipmentStickerLabel(req, res) {
    try {
        const { order_id } = req.query;  

        if (!order_id) {
            return responseGenerator(res, 'Missing order id  ', STATUSCODE.BADREQUEST, null);
        }

        const order = await orders.findOne({ where: { Id: order_id } });
        if (!order) {
            return responseGenerator(res, 'order not found', STATUSCODE.NOT_FOUND, null);
        }

        const shipmentId = order.shipping_id;
        if (!shipmentId) {
            return res.status(400).json({ error: "Missing shipment ID in the order" });
        }

        const response = await shipLogicAPI.get(`/shipments/label/stickers?id=${shipmentId}`);

        return responseGenerator(res, "shipping Stickers retrived", STATUSCODE.OK, response.data);
    } catch (error) {
        console.error("Error during sticker label retrieval:", error.message);
        return responseGenerator(res, error.response?.data || error.message, STATUSCODE.SERVER_ERROR, null);
    }
}

                 // for return from shiplogic

                 static async createReturnOrder(req, res) {
                    try {
                        const { company_Id, delivery_Id, product_Id, user_Id, order_Id,  } = req.body;
                        console.log("Request Body:", req.body);
                        if (!company_Id || !delivery_Id || !product_Id || !user_Id || !order_Id ) {
                            return res.status(400).json({ error: "Missing required fields in the request body" });
                        }
                
                        const collectionData = await company_addresses.findOne({ where: { Id: company_Id } });
                        if (!collectionData) {
                            return res.status(404).json({ error: 'Collection address not found' });
                        }
                
                        const deliveryData = await delivery_addresses.findOne({ where: { Id: delivery_Id } });
                        if (!deliveryData) {
                            return res.status(404).json({ error: 'Delivery address not found' });
                        }
                
                        const productData = await products.findAll({ where: { Id: product_Id } });
                        if (!productData.length) {
                            return res.status(404).json({ error: 'Products not found' });
                        }
                
                        const userData = await users.findOne({ where: { Id: user_Id } });
                        if (!userData) {
                            return res.status(404).json({ error: 'User not found' });
                        }
                
                        const orderData = await orders.findOne({ where: { Id: order_Id } });
                        if (!orderData) {
                            return res.status(404).json({ error: 'Order not found' });
                        }
                
                        const currentDate = new Date();
                        const deliveryDate = new Date(currentDate);
                        deliveryDate.setDate(deliveryDate.getDate() + 3);
                
                        const payload = {
                            collection_address: {
                                type: "residential",
                                company: "",
                                street_address: deliveryData.address,
                                city: deliveryData.city,
                                country: deliveryData.country,
                                code: (deliveryData.pincode).toString(),
                            },
                            collection_contact: {
                                name: deliveryData.name,
                                mobile_number: deliveryData.mobile,
                                email: userData.email,
                            },
                            delivery_address: {
                                type: "business",
                                company: collectionData.company_name,
                                street_address: collectionData.address,
                                city: collectionData.city,
                                country: collectionData.country,
                                code: (collectionData.pincode).toString(),
                            },
                            delivery_contact: {
                                name: collectionData.company_name,
                                mobile_number: collectionData.mobile_number,
                                email: collectionData.company_email,
                            },
                            parcels: productData.map(product => ({
                                submitted_length_cm: product.product_length,
                                submitted_width_cm: product.product_width,
                                submitted_height_cm: product.product_height,
                                submitted_weight_kg: product.product_weight
                            })),
                            special_instructions_collection: "Return - Please collect",
                            special_instructions_delivery: "Return - Please deliver",
                            declared_value: 0,
                            collection_min_date: currentDate.toISOString(),
                            collection_after: "08:00",
                            collection_before: "16:00",
                            delivery_min_date: deliveryDate.toISOString(),
                            delivery_after: "10:00",
                            delivery_before: "17:00",
                            custom_tracking_reference: "",
                            customer_reference: orderData.tracking_number,
                            service_level_code: "ECO",
                            mute_notifications: false,
                          
                        };
                

                        const response = await shipLogicAPI.post("/shipments", payload);
            
                        res.status(200).json({ data: response.data });
                    } catch (error) {
                        res.status(500).json({ error: error.response?.data || error.message });
                    }
                }
            };