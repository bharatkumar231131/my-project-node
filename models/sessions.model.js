import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import users from "./users.model.js";

class sessions extends Model { }

sessions.init({
    user_id:{
        type:DataTypes.STRING
    },
    ip_address:{
        type:DataTypes.STRING
    },
    user_agent:{
        type:DataTypes.STRING
    },
    payload:{
        type:DataTypes.TINYINT
    },
    last_activity:{
        type:DataTypes.INTEGER
    }
}, {
    ModelName: ModelName.sessions,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.sessions,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default sessions;

