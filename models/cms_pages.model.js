import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class cms_pages extends Model { }

cms_pages.init({
    id: {
        type: DataTypes.BIGINT,
        defaultValue: DataTypes.BIGINT,
        primaryKey: true
    },
    page_title:{
        type:DataTypes.STRING
    },
    html_content: {
        type: DataTypes.TEXT
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
    ModelName: ModelName.cms_pages,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.cms_pages,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default cms_pages;

