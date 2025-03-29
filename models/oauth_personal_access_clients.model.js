import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class oauth_personal_access_clients extends Model { }

oauth_personal_access_clients.init({
    client_id: {
        type: DataTypes.BIGINT
    },
    created_at:{
        type:DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.oauth_personal_access_clients,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.oauth_personal_access_clients,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default oauth_personal_access_clients;

