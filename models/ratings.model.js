import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class ratings extends Model { }

ratings.init({
    user_id:{
        type:DataTypes.INTEGER
    },
    product_id:{
        type:DataTypes.INTEGER
    },
    review:{
        type:DataTypes.TEXT
    },
    rating:{
        type:DataTypes.INTEGER
    },
    status:{
        type:DataTypes.TINYINT
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
    ModelName: ModelName.ratings,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.ratings,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default ratings;
