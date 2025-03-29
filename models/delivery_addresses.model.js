import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
// import users from "./users.model.js";

class delivery_addresses extends Model { }

delivery_addresses.init({
   user_id:{
    type: DataTypes.INTEGER
   },
    name: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    city:{
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    pincode: {
        type: DataTypes.STRING
    },
    mobile:{
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.TINYINT
    },
    type:{
        type:DataTypes.STRING
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.delivery_addresses,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.delivery_addresses,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default delivery_addresses;



