import bcrypt from "bcryptjs";
import {dataFound,parameterNotFound,dataNotFound,otpGenerator,responseGenerator} from "../helper/function.helper.js";
import STATUSCODE from "../server/statusCode.js";
import { generateToken } from "../helper/jwt.helper.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import users from "../models/users.model.js";
import sgMail from "@sendgrid/mail";
import ejs from "ejs";
 

sgMail.setApiKey(process.env.SGMAIL_API_KEY);

export class AuthController {
  static signUp = async (req, res, next) => {
    const { name, mobile, email, password} = req.body;
    
    try {
      const existingUser = await users.findOne({ where: { email } });
      if (existingUser) {
        return responseGenerator(
          res,
          "Email already exists",
          STATUSCODE.BADREQUEST,
          { existingUser }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 15);
      const newUser = await users.create({
        name,
        mobile,
        email,
        status: 0,
        password: hashedPassword,
      });

      
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_ACCESS_TOKEN_KEY, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY,
       
      });
      const verificationLink = `http://213.210.21.175:5001/AW0001/api/v1/verify-token?token=${token}`;;

      
      const emailHtml = await ejs.renderFile("./views/emailverification.ejs", {
        name,
        verificationLink,
      });

      // Send verification email
      const msg = {
        to: email,
        from: process.env.SGMAIL,
        subject: "Email Verification",
        html: emailHtml,
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((err) => {
          err.status = 404;
          console.log(err);
        });

      return responseGenerator(
        res,
        "User Created. Please check your email for verification.",
        STATUSCODE.CREATED,
        { newUser, token }
      );
    } catch (error) {
      next(error);
    }
  };
  static verifyToken = async (req, res) => {
    const token = req.query.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_KEY);

      await users.update({ status: 1 }, { where: { id: decoded.userId } });
     
      res.status(200).send('Account verified successfully!');
    } catch (error) {
      return res.status(400).send("Invalid or expired token");
    }
  };

  static signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await users.findOne({ where: { email } });
      if (!user) {
        return responseGenerator(res, 'Email or password is incorrect', STATUSCODE.UNAUTHORIZED);
      }

      if (user.status !== 1) {
        return responseGenerator(res, 'Please verify your email before logging in', STATUSCODE.UNAUTHORIZED);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return responseGenerator(res, 'Email or password is incorrect', STATUSCODE.UNAUTHORIZED);
      }
  
      const token = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_TOKEN_KEY, { expiresIn: process.env.JWT_ACCESS_EXPIRY });
  
      return responseGenerator(res, 'Login successful', STATUSCODE.OK, { user, token });
    } catch (error) {
      next(error);
    }
  };

  
  static updateUser = async (req, res, next) => {
    const { user_id } = req.query;
    const updateData = req.body;

    try {
      const user = await users.findOne({ where: { id: user_id } });
      if (!user) {
        dataNotFound(user, "User Not Found", STATUSCODE.NOT_FOUND);
      }

      // await user.update(updateData); ---testme---

      await users.update(updateData, { where: { id: user_id } });

      const updatedUser = await users.findOne({ where: { id: user_id } });
      return responseGenerator(
        res,
        "User Detail Updated Successful",
        STATUSCODE.OK,
        updatedUser
      );
    } catch (error) {
      next(error);
    }
  };

  static emailVerification = async (req, res, next) => {
    const { toEmail, subject, name } = req.body;
    const key = sgMail.setApiKey(process.env.SGMAIL_API_KEY);
    try {
      const emailHtml = await ejs.renderFile("./views/emailverification.ejs", {
        name,
      });

      const msg = {
        to: toEmail,
        from: process.env.SGMAIL,
        subject: subject,
        html: emailHtml,
      };

      const data = await sgMail.send(msg);
      if (data[0].statusCode == 202) {
        return res.send("Email sent successfully!");
      } else {
        return res.status(400).send("Failed to send email.");
      }
    } catch (error) {
      next(error);
    }
  };

  static forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ 
                status: 404,
                message: 'User Not Found' 
            });
        }

        const name = user.name;
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 15);

        await users.update({ password: hashedPassword }, { where: { email } });

        sgMail.setApiKey(process.env.SGMAIL_API_KEY);

        const emailHtml = await ejs.renderFile('./views/forgetpassword.ejs', { name, password });

        const msg = {
            to: email,
            from: process.env.SGMAIL,
            subject: "Forget Password",
            html: emailHtml,
        };

        const data = await sgMail.send(msg);

        if (data[0].statusCode === 202) {
            return res.status(200).json({ 
                status: 200,
                message: "A new password has been sent to your email." 
            });
        } else {
            return res.status(500).json({ 
                status: 500,
                message: 'Failed to send email' 
            });
        }
    } catch (error) {
        next(error);
    }
};

  static updatePassword = async (req, res, next) => {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return responseGenerator(res, 'New passwords do not match', STATUSCODE.BADREQUEST);
    }
  
    try {
      const user = await users.findOne({ where: { email } });
      if (!user) {
        return responseGenerator(res, 'User Not Found', STATUSCODE.NOT_FOUND);
      }
  
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return responseGenerator(res, 'Old password is incorrect', STATUSCODE.UNAUTHORIZED);
      }
  
      const hashedNewPassword = await bcrypt.hash(newPassword, 15);
      await users.update({ password: hashedNewPassword }, { where: { email } });
  
      return responseGenerator(res, 'Password updated successfully', STATUSCODE.OK);
    } catch (error) {
      next(error);
    }
  };
  


  static getAllUsers = async (req, res, next) => {
    try {
      const user = await users.findAll();
      console.log("sd", user);
      return responseGenerator(
        res,
        "Users retrieved successfully",
        STATUSCODE.OK,
        { user }
      );
    } catch (error) {
      next(error);
    }
  };

  static getUserById = async (req, res, next) => {
    
        try {
          const userId =  req.userId; // User Id by the isAuth middleware
          const user = await users.findByPk(userId);
    
          if (!user) {
            return responseGenerator(res, "User Not Found", STATUSCODE.NOT_FOUND);
          }
    
          return responseGenerator(
            res,
            "User retrieved successfully",
            STATUSCODE.OK,
            { user }
          );
        } catch (error) {
          next(error);
        }
      };
    }
    
