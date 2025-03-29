import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class banners extends Model { }

banners.init({
    image: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    title: {
        type: DataTypes.STRING
    },
    alt: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING
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
    ModelName: ModelName.banners,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.banners,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default banners;

