import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import products from "./products.model.js";

class products_images extends Model { }

products_images.init({
    product_id:{
        type:DataTypes.INTEGER,
        references: {
            model: products, 
            key: "id"        
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    image:{
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
    ModelName: ModelName.products_images,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.products_images,
    collate: "utf8mb4_bin",
    timestamps:false
});
products.hasMany(products_images, { foreignKey: 'product_id' });
products_images.belongsTo(products, { foreignKey: 'product_id' });

export default products_images;

