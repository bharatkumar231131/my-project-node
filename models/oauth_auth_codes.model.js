import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import users from "./users.model.js";

class oauth_auth_codes extends Model { }

oauth_auth_codes.init({
    
    client_id: {
        type: DataTypes.BIGINT
    },
    scopes: {
        type: DataTypes.TEXT
    },
    revoked: {
        type: DataTypes.TINYINT
    },
    expires_at:{
        type: DataTypes.DATE
    }
}, {
    ModelName: ModelName.oauth_auth_codes,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.oauth_auth_codes,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default oauth_auth_codes;

