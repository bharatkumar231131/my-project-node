import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import users from "./users.model.js";

class oauth_access_tokens extends Model { }

oauth_access_tokens.init({
    client_id: {
        type: DataTypes.BIGINT
    },
    name: {
        type: DataTypes.STRING
    },
    scopes: {
        type: DataTypes.TEXT
    },
    revoked: {
        type: DataTypes.TINYINT
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    },
    expires_at:{
        type: DataTypes.DATE
    }
}, {
    ModelName: ModelName.oauth_access_tokens,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.oauth_access_tokens,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default oauth_access_tokens;

users.hasMany(oauth_access_tokens, { foreignKey: "user_id" });
oauth_access_tokens.belongsTo(users, { foreignKey: "user_id" });
