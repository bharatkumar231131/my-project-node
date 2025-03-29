import express from "express";
import { OrderController } from "../controller/order.controller.js";

const router = express.Router();

router.get('/getallorderforuser',OrderController.getAllOrdersForUser);
router.get('/getorderbyid',OrderController.getOrderDetailsById); 
router.post('/submit-return',OrderController.submitReturnRequest);
router.post('/ordersummary',OrderController.orderSummery);
router.post('/addorder',OrderController.createOrder);
// for delivery address
router.post('/addDeliveryAddress',OrderController.addDeliveryAddress);
router.put('/editDeliveryAddress', OrderController.editDeliveryAddress);
router.get('/getDeliveryAddress',OrderController.getDeliveryAddress);
router.post('/choosedeliverytype',OrderController.chooseDeliveryType);

export default router;