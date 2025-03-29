import jwt from "jsonwebtoken"
import STRINGCONST from "../server/stringConstant.js";
import STATUSCODE from "../server/statusCode.js";
import { dataNotFound, responseGenerator } from "../helper/function.helper.js";
import users from "../models/users.model.js";


export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.get("Authorization");
        dataNotFound(authHeader, 'Token', STATUSCODE.NOT_FOUND, true);

        

        const JWToken = authHeader.split(" ")[1];
        dataNotFound(JWToken, 'Token', STATUSCODE.NOT_FOUND, true);

        let token;
        try {
            token = jwt.verify(JWToken, process.env.JWT_ACCESS_TOKEN_KEY);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return responseGenerator(res, { message: 'Token expired, please log in again' }, STATUSCODE.UNAUTHORIZED);
            }
            return responseGenerator(res, { message: STRINGCONST.INVALID_TOKEN }, STATUSCODE.UNAUTHORIZED);
        }

        if (!token) {
            return dataNotFound(token, STRINGCONST.INVALID_TOKEN, STATUSCODE.UNAUTHORIZED);
        }

        const user = await users.findByPk(token.userId);
        dataNotFound(user, 'User', STATUSCODE.NOT_FOUND, true);
        req.userId = user.id;
        req.userType = user.isAdmin ? 'admin' : user.type
        next();
    } catch (error) {
        next(error);
    }
};
