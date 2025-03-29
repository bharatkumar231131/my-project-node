import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class logos extends Model { }

logos.init({
    type: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.logos,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.logos,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default logos;