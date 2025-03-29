import express from "express";
import { BannersController } from "../controller/banner.controller.js";

const router = express.Router();

router.get('/getallbanner',BannersController.getAllBanners);
router.get('/getbannerbyid',BannersController.getBannersById);

export default router;