import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class vendors extends Model { }

vendors.init({
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
    confirm:{
        type:DataTypes.BOOLEAN
    },
    commission:{
        type:DataTypes.STRING
    },
    status:{
        type:DataTypes.TINYINT
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
    ModelName: ModelName.vendors,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.vendors,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default vendors;

