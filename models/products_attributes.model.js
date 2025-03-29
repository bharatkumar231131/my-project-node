import { DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";

class Products_attributes extends Model { }

Products_attributes.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    attribute_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE(8, 2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null
    },
    updated_at: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null
    }
}, {
    modelName: ModelName.Products_attributes,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.Products_attributes,
    collate: "utf8mb4_unicode_ci",
    timestamps: false
});

export default Products_attributes;
