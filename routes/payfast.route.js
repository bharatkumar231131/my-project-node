import express from "express";
import { PayFastController } from "../controller/PayFast.controller.js";

const router = express.Router();

router.post('/generate-payment', PayFastController.generatePaymentForm);

router.post('/handle-ipn', PayFastController.handleIPN);

router.post('/tansactionsDetails', PayFastController.transactionsDetails )


export default router;