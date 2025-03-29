import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class return_orders extends Model { }

return_orders.init({
    user_id:{
        type:DataTypes.INTEGER
    },
    order_id:{
        type:DataTypes.INTEGER
    },
    product_id:{
        type:DataTypes.TEXT
    },
    status:{
        type:DataTypes.STRING
    },
    return_reason:{
        type:DataTypes.STRING
    },
    tracking_number:{
        type:DataTypes.TEXT
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.return_orders,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.return_orders,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default return_orders;

