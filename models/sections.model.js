import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class sections extends Model { }

sections.init({
    name:{
        type:DataTypes.STRING
    },
    section_image:{
        type:DataTypes.STRING
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
    ModelName: ModelName.sections,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.sections,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default sections;

