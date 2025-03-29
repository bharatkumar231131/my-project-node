import axios from 'axios';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import { dataFound,parameterNotFound, dataNotFound, otpGenerator, responseGenerator } from "../helper/function.helper.js";
import STATUSCODE from "../server/statusCode.js";
import { Op } from "sequelize";
import { User, Orders, orderProduct, transaction } from '../models/index.js';
import payments from '../models/payments.model.js';




export class PayFastController {

    
    static generatePaymentForm = async (req, res, next) => {
        const { amount, item_name, user_email } = req.body;
    
        try {
            const Data = {};
            // Merchant details 
            Data["merchant_id"] = "10000100";
            Data["merchant_key"] = "46f0cd694581a";
            Data["return_url"] = "http://www.yourdomain.co.za/return_url";
            Data["cancel_url"] = "http://www.yourdomain.co.za/cancel_url";
            Data["notify_url"] = "http://www.yourdomain.co.za/notify_url";
            // Buyer details
            Data["name_first"] = "Adil";
            Data["name_last"] = "Khan";
            Data["email_address"] = user_email;
            // Transaction details
            Data["m_payment_id"] = "1234";
            Data["amount"] = amount;
            Data["item_name"] = item_name;
    
            const generateSignature = (Data, passPhrase = null) => {
                let pfOutput = "";
                for (let key in Data) {
                    if (Data.hasOwnProperty(key) && Data[key] !== "") {
                        pfOutput += `${key}=${encodeURIComponent(Data[key].trim()).replace(/%20/g, "+")}&`;
                    }
                }
                let getString = pfOutput.slice(0, -1);
                if (passPhrase !== null) {
                    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
                }
                return crypto.createHash("md5").update(getString).digest("hex");
            };
    
            const Passphrase = 'jt7NOE43FZPn';
            Data["signature"] = generateSignature(Data, Passphrase);
    
            const testingMode = true;
            const pfHost = testingMode ? 'sandbox.payfast.co.za' : 'www.payfast.co.za';
    
            const response = await axios.post(`https://${pfHost}/eng/process`, Data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
    
            console.log('response', response);
            return res.status(200).json({
                message: "Payment  Created",
                data: response.data
            });
    
        } catch (error) {
            next(error);
        }
    };
    

    static handleIPN = async (req, res, next) => {
        const ipnData = req.body;

        try {
            const signature = ipnData.signature;
            delete ipnData.signature;
            const payFastDetails = {
                merchant_key: '46f0cd694581a',
            };

            const ipnSignatureString = Object.values(ipnData).join('|') + payFastDetails.merchant_key;
            const generatedSignature = crypto.createHmac('sha512', payFastDetails.merchant_key).update(ipnSignatureString).digest('hex');

            if (signature === generatedSignature) {
                if (ipnData.payment_status === 'COMPLETE') {
                    return responseGenerator(res, "Payment Confirmed", STATUSCODE.OK, ipnData);
                } else {
                    return responseGenerator(res, "Payment Failed", STATUSCODE.BADREQUEST, ipnData);
                }
            } else {
                return responseGenerator(res, "Invalid IPN Signature", STATUSCODE.UNAUTHORIZED);
            }
        } catch (error) {
            next(error);
        }
    };



    static transactionsDetails = async (req, res) => {
        const { order_id, user_id, amount, payment_status } = req.body;
    
        try {
            const order = await Orders.findByPk(order_id);
            if (!order) {
                return responseGenerator(res, "Order not found", STATUSCODE.NOT_FOUND);
            }
    
            const orderProducts = await orderProduct.findAll({ where: { order_id: order_id } });
            if (!orderProducts || orderProducts.length === 0) {
                return responseGenerator(res, "Ordered product not found", STATUSCODE.NOT_FOUND);
            }
    
            const user = await User.findByPk(user_id);
            if (!user) {
                return responseGenerator(res, "User not found", STATUSCODE.NOT_FOUND);
            }
            console.log('User found:', user);
    
            const newPayment = await payments.create({
                order_id,
                user_id,
                payment_id: order_id,
                payer_id: order_id,
                payer_email: user.email,
                amount,
                currency: "R",
                payment_status
            });
    
            const transaction_id = crypto.randomBytes(16).toString('hex');           

            for (const product of orderProducts) {
                const newTransaction = await transaction.create({
                    user_name: user.name,
                    transaction_id,
                    product_name: product.product_name, 
                    amount,
                    payment_method: "Payfast"
                });
                console.log('New transaction:', newTransaction);
            }
    
            return responseGenerator(res, "Transaction successful", STATUSCODE.CREATED);
        } catch (error) {
            next(error);
        }
    };
}
    