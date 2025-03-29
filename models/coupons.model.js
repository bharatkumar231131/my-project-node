import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class coupons extends Model { }

coupons.init({
    vendor_id: {
        type: DataTypes.INTEGER
    },
    coupon_option: {
        type: DataTypes.STRING
    },
    coupon_code:{
        type:DataTypes.STRING
    },
    categories: {
        type: DataTypes.STRING
    },
    brands: {
        type: DataTypes.STRING,
    },
    users: {
        type: DataTypes.TEXT
    },
    coupon_type: {
        type: DataTypes.STRING
    },
    coupon_uses: {
        type: DataTypes.INTEGER
    },
    amount_type: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.DOUBLE
    },
    expiry_date: {
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
    ModelName: ModelName.coupons,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.coupons,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default coupons;

// admin.hasMany(vendors, { foreignKey: "vendor_id" });
// vendors.belongsTo(admin, { foreignKey: "vendor_id" });