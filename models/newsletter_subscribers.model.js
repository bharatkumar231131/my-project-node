import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class newsletter_subscribers extends Model { }

newsletter_subscribers.init({
    email: {
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
    ModelName: ModelName.newsletter_subscribers,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.newsletter_subscribers,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default newsletter_subscribers;