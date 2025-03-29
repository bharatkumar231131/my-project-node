import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class countries extends Model { }

countries.init({
    country_code: {
        type: DataTypes.STRING
    },
    country_name: {
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
    },
    deleted_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.countries,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.countries,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default countries;

