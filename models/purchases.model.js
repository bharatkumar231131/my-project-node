import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class purchases extends Model { }

purchases.init({
    order_id:{
        type:DataTypes.INTEGER
    },
    supplier_id:{
        type:DataTypes.INTEGER
    },
    sroduct_id:{
        type:DataTypes.INTEGER
    },
    sku:{
        type:DataTypes.STRING
    },
    quantity:{
        type:DataTypes.INTEGER
    },
    purchase_price:{
        type:DataTypes.INTEGER
    },
    total_amount:{
        type:DataTypes.INTEGER
    },
    payment_status:{
        type:DataTypes.STRING
    },
    payment_method:{
        type:DataTypes.STRING
    },
    received_status:{
        type:DataTypes.STRING
    },
    purchase_order_number:{
        type:DataTypes.STRING
    },
    tax:{
        type:DataTypes.INTEGER
    },
    discount: {
        type: DataTypes.INTEGER
    },
    shipping_charge: {
        type: DataTypes.INTEGER
    },
    location: {
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
    ModelName: ModelName.purchases,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.purchases,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default purchases;
