import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class migrations extends Model { }

migrations.init({
    migration: {
        type: DataTypes.STRING
    },
    batch: {
        type: DataTypes.INTEGER
    }
}, {
    ModelName: ModelName.migrations,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.migrations,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default migrations;