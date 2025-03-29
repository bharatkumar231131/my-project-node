import { BOOLEAN, DataTypes, Model } from "sequelize";
import database from "../database/init.sql.js";
import ModelName from "../database/model_name.sql.js";


class products extends Model { }

products.init({
    
    section_id:{
        type:DataTypes.INTEGER
    },
    category_id:{
        type:DataTypes.INTEGER
    },
    brand_id:{
        type:DataTypes.INTEGER
    },
    vendor_id:{
        type:DataTypes.INTEGER
    },
    admin_id:{
        type:DataTypes.INTEGER
    },
    admin_type:{
        type:DataTypes.STRING
    },
    product_name: {
        type: DataTypes.STRING
    },
    product_code: {
        type: DataTypes.STRING
    },
    product_color: {
        type: DataTypes.STRING
    },
    product_price: {
        type: DataTypes.FLOAT
    },
    product_discount: {
        type: DataTypes.FLOAT
    },
    product_weight: {
        type: DataTypes.DOUBLE(10, 2)
    },
    product_length: {
        type: DataTypes.INTEGER
    },
    product_width: {
        type: DataTypes.INTEGER
    },
    product_height: {
        type: DataTypes.INTEGER
    },
    product_image: {
        type: DataTypes.STRING
    },
    product_video: {
        type: DataTypes.STRING
    },
    group_code: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    test: {
        type: DataTypes.STRING
    },
    filtercolumn: {
        type: DataTypes.STRING
    },
    mini: {
        type: DataTypes.STRING
    },
    testfiltername: {
        type: DataTypes.STRING
    },
    length:{
        type:DataTypes.STRING
    },
    cable_lenght: {
        type: DataTypes.STRING
    },
    jkdscbj: {
        type: DataTypes.STRING
    },
    t_shirt: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING
    },
    operating_system: {
        type: DataTypes.STRING
    },
    screen_size: {
        type: DataTypes.STRING
    },
    occasion: {
        type: DataTypes.STRING
    },
    fit: {
        type: DataTypes.STRING
    },
    pattern: {
        type: DataTypes.STRING
    },
    sleeve: {
        type: DataTypes.STRING
    },
    ram: {
        type: DataTypes.STRING
    },
    fabric: {
        type: DataTypes.STRING
    },
    meta_title: {
        type: DataTypes.STRING
    },
    meta_description: {
        type: DataTypes.STRING
    },
    is_featured: {
        type: DataTypes.BOOLEAN
    },
    is_bestseller: {
        type: DataTypes.BOOLEAN
    },
    created_at:{
        type: DataTypes.DATE
    },
    updated_at:{
        type: DataTypes.DATE
    },
    deleted_at:{
        type: DataTypes.DATE
    },
    status:{
            type: DataTypes.TINYINT
    }
    
}, {
    ModelName: ModelName.products,
    paranoid: false,
    sequelize: database,
    tableName: ModelName.products,
    collate: "utf8mb4_bin",
    timestamps:false
});

export default products;
