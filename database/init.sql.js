import { Sequelize } from "sequelize";
import STRINGCONST from "../server/stringConstant.js"
import mysql from "mysql2";

const { DATABASE, DB_USERNAME, PASSWORD, HOST, DBPORT, MAXIMUM_RETRY_COUNT, RETRY_TIMEOUT } = process.env;
mysql.createConnection({
    host: HOST,
    port: DBPORT,
    user: DB_USERNAME,
    password: PASSWORD
}).query(`CREATE DATABASE IF NOT EXISTS ${DATABASE};`);

const connection = new Sequelize(DATABASE, DB_USERNAME, PASSWORD, {
    dialect: "mysql",
    host: HOST,
    port: DBPORT,
    logging: false,
    retry: {
        max: MAXIMUM_RETRY_COUNT,
        timeout: RETRY_TIMEOUT,
    },

});

connection.authenticate(() => {
    console.info(STRINGCONST.AUTHENTICATE_MESSAGE)
});

export default connection;