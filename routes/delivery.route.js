import express from "express";
import {deliveryController } from "../controller/delivery.controller.js";

const router = express.Router();

router.post('/calculateRate',deliveryController.calculateRate);
router.post('/createshippingorder',deliveryController.createShippingOrder);

router.get('/getshippinglabel',deliveryController.getShippingLabel);
router.get('/trackorder',deliveryController.trackOrder);
router.post('/cancelorder',deliveryController.cancelOrder);

router.post('/createReturnOrder',deliveryController.createReturnOrder);


export default router;