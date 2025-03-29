import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class personal_access_tokens extends Model { }

personal_access_tokens.init({
    tokenable_type:{
        type:DataTypes.STRING
    },

    tokenable_id:{
        type:DataTypes.BIGINT
    },
    name:{
        type:DataTypes.STRING
    },
    token:{
        type:DataTypes.STRING
    },
    abilities:{
        type:DataTypes.TEXT
    },
    last_user_at:{
        type:DataTypes.TIME
    },
    expires_at:{
        type: DataTypes.TIME
    },
    created_at:{
        type: DataTypes.TIME
    },
    updated_at:{
        type: DataTypes.TIME
    }
}, {
    ModelName: ModelName.personal_access_tokens,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.personal_access_tokens,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default personal_access_tokens;

