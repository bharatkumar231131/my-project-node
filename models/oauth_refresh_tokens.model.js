import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class oauth_refresh_tokens extends Model { }

oauth_refresh_tokens.init({
    access_token_id: {
        type: DataTypes.STRING
    },
    revoked:{
        type:DataTypes.TINYINT
    },
    expires_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.oauth_refresh_tokens,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.oauth_refresh_tokens,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default oauth_refresh_tokens;

