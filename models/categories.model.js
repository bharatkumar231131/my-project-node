import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import vendors from "./vendors.model.js";


class categories extends Model { }

categories.init({
    parent_id: {
        type: DataTypes.INTEGER
    },
    section_id: {
        type: DataTypes.INTEGER
    },
    category_name:{
        type:DataTypes.STRING
    },
    category_image:{
        type:DataTypes.STRING
    },
    category_banner_image:{
        type:DataTypes.STRING
    },
    category_discount: {
        type: DataTypes.DOUBLE
    },
    description: {
        type: DataTypes.TEXT,
    },
    url: {
        type: DataTypes.STRING
    },
    meta_title: {
        type: DataTypes.STRING
    },
    meta_description: {
        type: DataTypes.STRING
    },
    meta_keywords: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.TINYINT
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
    ModelName: ModelName.categories,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.categories,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default categories;

