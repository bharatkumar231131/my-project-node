import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class users extends Model { }

users.init({
    name:{
        type:DataTypes.STRING
    },
    address:{
        type:DataTypes.STRING
    },
    city:{
        type:DataTypes.STRING
    },
    state:{
        type:DataTypes.STRING
    },
    country:{
        type:DataTypes.STRING
    },
    pincode:{
        type:DataTypes.STRING
    },
    mobile:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    email_verified_at:{
        type:DataTypes.STRING
    },
    password:{
        type:DataTypes.STRING
    },
    status:{
        type:DataTypes.TINYINT
    },
    remember_token:{
        type:DataTypes.STRING
    },
    access_token:{
        type:DataTypes.STRING
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
    ModelName: ModelName.users,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.users,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default users;

