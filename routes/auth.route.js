import express from "express";
import { AuthController } from "../controller/auth.controller.js";
import {isAuth}  from '../middleware/auth.middleware.js'; 

const router = express.Router();

router.post('/signup',AuthController.signUp);
router.get('/verify-token', AuthController.verifyToken);
router.post('/signin',AuthController.signIn);
router.put('/updateuser',AuthController.updateUser);
router.post('/emailverification',AuthController.emailVerification);
router.post('/forgotpassword',AuthController.forgotPassword);
router.get('/getAllUsers',AuthController.getAllUsers);
router.get('/userById',isAuth, AuthController.getUserById);
router.put('/update-password', AuthController.updatePassword);

export default router;