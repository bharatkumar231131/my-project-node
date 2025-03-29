import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import vendors from "./vendors.model.js";


class orders_products extends Model { }

orders_products.init({
    order_id:{
        type:DataTypes.INTEGER
    },
    user_id:{
        type:DataTypes.INTEGER
    },
    vendor_id:{
        type:DataTypes.INTEGER
    },
    admin_id:{
        type:DataTypes.INTEGER
    },
    product_id:{
        type:DataTypes.INTEGER
    },
    product_code: {
        type: DataTypes.STRING
    },
    product_name: {
        type: DataTypes.STRING
    },
    product_color: {
        type: DataTypes.STRING
    },
    product_size: {
        type: DataTypes.STRING
    },
    product_price: {
        type: DataTypes.DOUBLE
    },
    product_qty: {
        type: DataTypes.INTEGER
    },
    item_status: {
        type: DataTypes.STRING
    },
    courier_name: {
        type: DataTypes.STRING
    },
    tracking_number: {
        type: DataTypes.STRING
    },
    commission: {
        type: DataTypes.FLOAT
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.orders_products,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.orders_products,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default orders_products;
