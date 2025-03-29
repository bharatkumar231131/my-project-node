import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class company_addresses extends Model { }

company_addresses.init({
    company_name: {
        type: DataTypes.STRING
    },
    company_email: {
        type: DataTypes.STRING
    },
    address:{
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING
    },
    pincode: {
        type: DataTypes.INTEGER
    },
    mobile_number: {
        type: DataTypes.STRING
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    },
    deleted_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.company_addresses,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.company_addresses,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default company_addresses;

