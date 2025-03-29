import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class recently_viewed_products extends Model { }

recently_viewed_products.init({
    product_id:{
        type:DataTypes.INTEGER
    },
    session_id:{
        type:DataTypes.STRING
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.recently_viewed_products,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.recently_viewed_products,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default recently_viewed_products;
