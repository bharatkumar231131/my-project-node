import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class wishlists extends Model { }

wishlists.init({
    user_id:{
        type:DataTypes.STRING
    },
    product_id:{
        type:DataTypes.STRING
    },
    status:{
        type:DataTypes.BOOLEAN
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
    ModelName: ModelName.wishlists,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.wishlists,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default wishlists;

