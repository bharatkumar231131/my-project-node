import jwt from "jsonwebtoken";
const { JWT_ACCESS_TOKEN_KEY, JWT_ACCESS_EXPIRY, JWT_REFRESH_TOKEN_KEY, JWT_REFRESH_EXPIRY } = process.env;

export const generateToken = (data) => {
    try {
        const accessToken = jwt.sign(data, JWT_ACCESS_TOKEN_KEY, { expiresIn: JWT_ACCESS_EXPIRY });
        const refreshToken = jwt.sign(data, JWT_REFRESH_TOKEN_KEY, { expiresIn: JWT_REFRESH_EXPIRY });
        return { accessToken, refreshToken };
    } catch (error) {
        next(error);
    }
};