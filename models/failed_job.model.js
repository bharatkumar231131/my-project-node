import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class failed_jobs extends Model { }

failed_jobs.init({
    uuid: {
        type: DataTypes.STRING
    },
    connection: {
        type: DataTypes.TEXT
    },
    queue:{
        type: DataTypes.TEXT
    },
    payload: {
        type: DataTypes.TEXT
    },
    exception: {
        type: DataTypes.TEXT
    },
    failed_at: {
        type: DataTypes.TEXT
    },
    
}, {
    ModelName: ModelName.failed_jobs,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.failed_jobs,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default failed_jobs;