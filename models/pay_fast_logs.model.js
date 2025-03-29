import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class pay_fast_logs extends Model { }

pay_fast_logs.init({
    logs: {
        type: DataTypes.TEXT
    },
    data: {
        type: DataTypes.TEXT
    },
    created_at:{
        type: DataTypes.DATE
    },
    updated_at:{
        type: DataTypes.DATE
    }
}, {
    ModelName: ModelName.pay_fast_logs,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.pay_fast_logs,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default pay_fast_logs;