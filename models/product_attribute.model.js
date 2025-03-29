import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class product_attribute extends Model { }

product_attribute.init({
    attribute_name:{
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
    ModelName: ModelName.product_attribute,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.product_attribute,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default product_attribute;

