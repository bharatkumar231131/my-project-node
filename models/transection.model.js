import { DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";

class transactions extends Model { }

transactions.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    product_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    ModelName: ModelName.transactions,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.transactions,
    collate: "utf8mb4_bin",
    timestamps: false
});

export default transactions;
