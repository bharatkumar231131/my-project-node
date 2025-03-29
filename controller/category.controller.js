
import {Categories} from "../models/index.js";
import { dataFound,parameterNotFound, dataNotFound, otpGenerator, responseGenerator } from "../helper/function.helper.js";
import STATUSCODE from "../server/statusCode.js";

import { Op } from "sequelize";

export class CategoryController{
    static getAllCategories = async (req,res,next) =>{
        try {
            const image_path="https://123ecommerce.co.za/public/front/images/category_images/"
            const categories= await Categories.findAll({
                    where: {
                        deleted_at: null,
                        status: 1
                }
            });
            const categoriesWithFullImagePath = categories.map(categories => {
                return {
                    ...categories.dataValues,
                    category_image: `${image_path}${categories.category_image}`,
                category_banner_image:`${image_path}${categories.category_banner_image}`
                };
            });
            return responseGenerator(res,"Categories Retrieved Successfully",STATUSCODE.OK,categoriesWithFullImagePath);

        } catch (error) {
            next(error);
        }
    };
    static getCategoriesById = async(req,res,next)=>{
        const {id}=req.query;
        const image_path="https://123ecommerce.co.za/public/front/images/category_images/"
        try {
            const category = await Categories.findOne({ where: { id:id, status: 1} });
            if(!category){
                dataNotFound(category,'Categories Not Found',STATUSCODE.NOT_FOUND);
            }
            const categoryWithFullImagePath = {
                ...category.dataValues,
                category_image: `${image_path}${category.category_image}`,
                category_banner_image:`${image_path}${category.category_banner_image}`
            };
            return responseGenerator(res,'Categories Fetching Successful',STATUSCODE.OK,categoryWithFullImagePath)
        } catch (error) {
            next(error);
        }
    };
    static getSubCategories = async (req, res,next) => {
        try {
          const { parent_id } = req.query;
          const image_path="https://123ecommerce.co.za/public/front/images/category_images/"
          if (!parent_id) {
            return responseGenerator(res,'parent id is required.',STATUSCODE.BADREQUEST)
          }
          const subCategories = await Categories.findAll({where: { parent_id: parent_id, status: 1 }});
          const subCategoriesWithImagePaths = subCategories.map((subcategory) => {
            return {
              ...subcategory.dataValues,
              category_image: `${image_path}${subcategory.category_image || ''}`,
              category_banner_image: `${image_path}${subcategory.category_banner_image || ''}`
            };
          });
      
          if (subCategories.length > 0) {
            return responseGenerator(res,'Subcategories Fetching Successful',STATUSCODE.OK,subCategoriesWithImagePaths)
          } else {
            return responseGenerator(res,'No subcategories found for the provided parent id.',STATUSCODE.NOT_FOUND)}
        } catch (error) {
        next(error)  
        };
}

static getCategoriesBySection = async (req, res, next) => {
    const { section_id } = req.query;
    const image_path = "https://123ecommerce.co.za/public/front/images/category_images/";

    try {
        const categoryList = await Categories.findAll({
            where: {
                section_id: section_id,
                deleted_at: null,
                status: 1
            }
        });

        const updatedCategoryList = categoryList.map(category => {
            return {
                ...category.toJSON(),
                category_image: `${image_path}${category.category_image}`,
                category_banner_image:`${image_path}${category.category_banner_image}`
            };
        });

        return responseGenerator(res, 'Categories Fetching Successful', STATUSCODE.OK, updatedCategoryList);
    } catch (error) {
        next(error);
    }
}
};