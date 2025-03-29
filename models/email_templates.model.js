import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class email_templates extends Model { }

email_templates.init({
    id: {
        type: DataTypes.BIGINT,
        defaultValue: DataTypes.BIGINT,
        primaryKey: true
    },
    template_name: {
        type: DataTypes.STRING
    },
    confirmation_message: {
        type: DataTypes.STRING
    },
    register_message:{
        type: DataTypes.TEXT
    },
    forgot_message: {
        type: DataTypes.STRING
    },
    resend_message: {
        type: DataTypes.STRING
    },
    sub_coupons: {
        type: DataTypes.STRING
    },
    sub_order_status:{
        type: DataTypes.STRING
    },
    sub_order_placed: {
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
    ModelName: ModelName.email_templates,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.email_templates,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default email_templates;