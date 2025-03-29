import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class cod_pincodes extends Model { }

cod_pincodes.init({
    pincode:{
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
    ModelName: ModelName.cod_pincodes,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.cod_pincodes,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default cod_pincodes;

