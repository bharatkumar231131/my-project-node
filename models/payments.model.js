import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class payments extends Model { }

payments.init({
    order_id: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER
    },
    payment_id: {
        type: DataTypes.STRING
    },
    payer_id: {
        type: DataTypes.STRING
    },
    payer_email: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.DOUBLE
    },
    currency: {
        type: DataTypes.STRING
    },
    payment_status: {
        type: DataTypes.STRING
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.payments,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.payments,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default payments;