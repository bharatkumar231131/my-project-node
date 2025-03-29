import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class product_filters_value extends Model { }

product_filters_value.init({
    filter_ids:{
        type:DataTypes.STRING
    },
    filter_value:{
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
    }
}, {
    ModelName: ModelName.product_filters_value,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.product_filters_value,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default product_filters_value;

