import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class product_filters extends Model { }

product_filters.init({
    cat_ids:{
        type:DataTypes.STRING
    },
    filter_name:{
        type:DataTypes.STRING
    },
    filter_column:{
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
    ModelName: ModelName.product_filters,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.product_filters,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default product_filters;

