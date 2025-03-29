import STATUSCODE from "../server/statusCode.js";

export const dataFound = (data, message, statuscode) => {
    if (data) {
        const error = new Error(message);
        error.statusCode = statuscode;
        throw error;
    }
};

export const dataNotFound = (data, message, statuscode, isCustomize) => {
    if (!data) {
        if (isCustomize) {
            message = message + ' not found';
        }
        const error = new Error(message);
        error.statusCode = statuscode;
        throw error;
    }
};

export const responseGenerator = (res, message, statuscode, data) => {
    return res.status(statuscode).json({
        message,
        statuscode,
        data,
        status: statuscode == 200 || statuscode == 201 ? true : false
    });
};

export const parameterNotFound = (parameter, key) => {
    if (!parameter) {
        const error = new Error(`Query parameter ${key} is missing`);
        error.statusCode = STATUSCODE.NOT_FOUND;
        throw error;
    }
};

export const otpGenerator = (size) => {
    const value = Math.pow(10, size - 1)
    return Math.floor(value + (Math.random() * (9 * value)))
};
