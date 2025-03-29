import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class brands extends Model { }

brands.init({
    name:{
        type:DataTypes.STRING
    },
    status: {
        type: DataTypes.TINYINT
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
    ModelName: ModelName.brands,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.brands,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default brands;

