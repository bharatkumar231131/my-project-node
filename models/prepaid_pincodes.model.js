import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class prepaid_pincodes extends Model { }

prepaid_pincodes.init({
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
    ModelName: ModelName.prepaid_pincodes,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.prepaid_pincodes,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default prepaid_pincodes;

