import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import vendors from "./vendors.model.js";


class orders_logs extends Model { }

orders_logs.init({
    order_id:{
        type:DataTypes.INTEGER
    },
    order_item_id:{
        type:DataTypes.INTEGER
    },
    order_status: {
        type: DataTypes.STRING
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.orders_logs,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.orders_logs,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default orders_logs;
