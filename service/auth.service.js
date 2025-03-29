// import bcrypt from "bcryptjs";
// import { Designation, DeviceInfo } from "../models/index.js";
// import { generateToken } from "../helper/jwt.helper.js";
// import STATUSCODE from "../server/statusCode.js";
// import { dataNotFound } from "../helper/function.helper.js";



// export const validatePassword = async (body, user) => {
//     try {
//         const isEqual = await bcrypt.compare(body.password, user.password);
//         dataNotFound(isEqual, 'Password not matched', STATUSCODE.BADREQUEST);
//         const designation = await Designation.findByPk(user.designationId);
//         const token = generateToken({
//             userId: user.id,
//             isAdmin: user.isAdmin,
//             phone: user.phone
//         });

//         return { message: 'Login successfully', statusCode: STATUSCODE.OK, response: { token, user } };
//     } catch (error) {
//         throw error;
//     }
// }

// export const createOTP = async (user, otp) => {
//     // dataNotFound(body.deviceId, 'deviceId', STATUSCODE.NOT_FOUND, true);
//     // dataNotFound(body.deviceToken, 'deviceToken', STATUSCODE.NOT_FOUND, true);
//     // let device = await DeviceInfo.findOne({ where: { userId: user.id, deviceId: body.deviceId } });

//     // if (!device) {
//     //     device = await createDevice({ ...body, otp, userId: user.id })
//     // } else {
//     //     await device.update({ otp, otpStatus: 0 })
//     //     await device.reload();
//     // }
//     const response = { ...user.dataValues, otp }
//     const message = 'OTP sent'
//     const statusCode = STATUSCODE.OK
//     return { response, message, statusCode }
// }

// export const validateOTP = async (user, body, type) => {
//     let message, statusCode, response;

//     // let device = await DeviceInfo.findOne({ where: { userId: user.id, deviceId: body.deviceId } });
//     // if (device.otp == body.otp) {
//     //     if (type == 'forgetPassword') {
//     //         return { message: 'OTP veirfied', statusCode: 200 };
//     //     }
//     //     if (device.otpStatus) {
//     //         message = 'OTP expired or used';
//     //         statusCode = STATUSCODE.UNAUTHORIZED;
//     //     } else {
//     //         const designation = await Designation.findByPk(user.designationId);
//     //         const token = generateToken({
//     //             userId: user.id,
//     //             isAdmin: user.isAdmin,
//     //             designation: designation && designation.name || 'admin',
//     //             phone: user.phone
//     //         });

//     //         await device.update({ otpStatus: 1, accessToken: token.accessToken, refreshToken: token.refreshToken })
//             response = { ...user.dataValues, ...token }
//             message = 'OTP verified successfully';
//             statusCode = STATUSCODE.CREATED;
//         }
//     } else {
//         message = 'Invalid OTP';
//         statusCode = STATUSCODE.UNAUTHORIZED;
//     }
//     return { message, statusCode, response }
// }