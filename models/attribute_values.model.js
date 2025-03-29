import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import product_attribute from "./product_attribute.model.js";

class attribute_values extends Model { }

attribute_values.init({
    product_attribute_id:{
        type:DataTypes.STRING
    },
    value:{
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
    ModelName: ModelName.attribute_values,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.attribute_values,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default attribute_values;



