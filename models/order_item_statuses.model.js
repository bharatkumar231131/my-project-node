import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import vendors from "./vendors.model.js";


class orders_item_statuses extends Model { }

orders_item_statuses.init({
    name: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.TINYINT
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.orders_item_statuses,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.orders_item_statuses,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default orders_item_statuses;
