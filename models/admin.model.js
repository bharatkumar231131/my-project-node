import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import vendors from "./vendors.model.js";


class admin extends Model { }

admin.init({
    name: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    vendor_id:{
        type:DataTypes.STRING
    },
    mobile: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    pincode: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    confirm: {
        type: DataTypes.TINYINT
    },
    status: {
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
    ModelName: ModelName.admin,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.admin,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default admin;

// admin.hasMany(vendors, { foreignKey: "vendor_id" });
// vendors.belongsTo(admin, { foreignKey: "vendor_id" });