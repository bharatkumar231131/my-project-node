import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class carts extends Model { }

carts.init({
    session_id:{
        type:DataTypes.STRING
    },
    user_id: {
        type: DataTypes.TINYINT
    },
    product_id: {
        type: DataTypes.TINYINT
    },
    size: {
        type: DataTypes.STRING
    },
    quantity: {
        type: DataTypes.TINYINT
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.carts,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.carts,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default carts;

