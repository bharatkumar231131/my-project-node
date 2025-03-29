import express from "express";
import { SectionController } from "../controller/section.controller.js";

const router = express.Router();

router.get('/allsection',SectionController.getAllSection);
router.get('/getSectionbyid',SectionController.getSectionById);

export default router;