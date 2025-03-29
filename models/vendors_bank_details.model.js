import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";
import vendors from "./vendors.model.js";


class vendors_bank_details extends Model { }

vendors_bank_details.init({
    account_holder_name:{
        type:DataTypes.STRING
    },
    bank_name:{
        type:DataTypes.STRING
    },
    account_number:{
        type:DataTypes.STRING
    },
    bank_ifsc_code:{
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
    ModelName: ModelName.vendors_bank_details,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.vendors_bank_details,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default vendors_bank_details;

vendors.hasMany(vendors_bank_details, { foreignKey: "vendor_id" });
vendors_bank_details.belongsTo(vendors, { foreignKey: "vendor_id" });

// vendors_bank_details.beforeDestroy(async (vendors_bank_details, option) => {
//     await Arrequest.update({ deletedAt: new Date() }, { where: { attendanceId: attendance.id } })
// });

