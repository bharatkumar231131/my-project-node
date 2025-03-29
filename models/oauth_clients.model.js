import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import users from "./users.model.js";

class oauth_clients extends Model { }

oauth_clients.init({
    name: {
        type: DataTypes.STRING
    },
    secret: {
        type: DataTypes.TEXT
    },
    provider: {
        type: DataTypes.STRING
    },
    redirect: {
        type: DataTypes.TEXT
    },
    personal_access_client: {
        type: DataTypes.TINYINT
    },
    password_client: {
        type: DataTypes.TINYINT
    },
    revoked: {
        type: DataTypes.TINYINT
    },
    created_at:{
        type:DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.oauth_clients,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.oauth_clients,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default oauth_clients;

users.hasMany(oauth_clients, { foreignKey: "user_id" });
oauth_clients.belongsTo(users, { foreignKey: "user_id" });
