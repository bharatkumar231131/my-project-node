import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class password_resets extends Model { }

password_resets.init({
    email: {
        type: DataTypes.STRING
    },
    token: {
        type: DataTypes.STRING
    },
    created_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.password_resets,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.password_resets,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default password_resets;