import express from "express";
import { CategoryController } from "../controller/category.controller.js";

const router = express.Router();

router.get('/getallcategory',CategoryController.getAllCategories);
router.get('/getCategorybyid',CategoryController.getCategoriesById);
router.get('/getSubCategory',CategoryController.getSubCategories);
router.get('/getCategorybysection',CategoryController.getCategoriesBySection);

export default router;