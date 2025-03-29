import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import ratings from "./ratings.model.js";


class rating_images extends Model { }

rating_images.init({
    rating_id:{
        type:DataTypes.INTEGER,
        references: {
            model: ratings, 
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
        type: DataTypes.DATE
    },
    updated_at:{
        type: DataTypes.DATE
    },
    deleted_at:{
        type: DataTypes.DATE
    }
}, {
    ModelName: ModelName.rating_images,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.rating_images,
    collate: "utf8mb4_bin",
    timestamps:false
});

ratings.hasMany(rating_images, { foreignKey: 'rating_id' });
rating_images.belongsTo(ratings, { foreignKey: 'rating_id' });
export default rating_images;
