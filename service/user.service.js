// import bcrypt from "bcryptjs";
// import { Admin } from '../models/index.js';
// import { Op } from "sequelize";
// import { dataNotFound } from "../helper/function.helper.js";
// import STATUSCODE from "../server/statusCode.js";

// const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE } = process.env;

// export const insertUserData = async () => {
//     try {
//         const isThere = await User.findOne({ where: { email: ADMIN_EMAIL } });
//         if (!isThere) {
//             await User.create({
//                 name: ADMIN_NAME,
//                 phone: ADMIN_PHONE,
//                 gender: 0,
//                 employeeCode: 1,
//                 email: ADMIN_EMAIL,
//                 password: await bcrypt.hash(ADMIN_PASSWORD, 15),
//                 isAdmin: true
//             });
//             console.log('User created successfully');
//         }
//     } catch (error) {
//         console.error('Error inserting data:', error);
//     }
// };
