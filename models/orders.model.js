import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import vendors from "./vendors.model.js";


class orders extends Model { }

orders.init({
    user_id:{
        type:DataTypes.INTEGER
    },
    shipping_id:{
        type:DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    city:{
        type:DataTypes.STRING
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
    mobile: {
        type: DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    delivery_option:{
        type:DataTypes.STRING
    },
    shipping_charges: {
        type: DataTypes.DOUBLE
    },
    coupon_code:{
        type:DataTypes.STRING
    },
    coupon_amount: {
        type: DataTypes.DOUBLE
    },
    order_status: {
        type: DataTypes.STRING
    },
    payment_method: {
        type: DataTypes.STRING
    },
    payment_gateway: {
        type: DataTypes.STRING
    },
    grand_total: {
        type: DataTypes.DOUBLE
    },
    courier_name: {
        type: DataTypes.STRING
    },
    tracking_number: {
        type: DataTypes.STRING
    },
    is_pushed: {
        type: DataTypes.TINYINT
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
    ModelName: ModelName.orders,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.orders,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default orders;
