
import {Banners} from "../models/index.js";
import { dataFound,parameterNotFound, dataNotFound, otpGenerator, responseGenerator } from "../helper/function.helper.js";
import STATUSCODE from "../server/statusCode.js";

import { Op } from "sequelize";

export class BannersController{
    static getAllBanners = async (req,res,next) =>{
        try {
            const image_path="https://123ecommerce.co.za/public/front/images/banner_images/"
            const banners= await Banners.findAll({
                where: {
                    deleted_at: null,
                    status: 1
                }
        });
            const bannersWithFullImagePath = banners.map(banner => {
                return {
                    ...banner.dataValues,
                    image: `${image_path}${banner.image}` ,
                    
                };
            });
            return responseGenerator(res,"Banners Retrieved Successfully",STATUSCODE.OK,bannersWithFullImagePath);

        } catch (error) {
            next(error);
        }
    };
    static getBannersById = async(req,res,next)=>{
        const {id}=req.query;
        try {
            const image_path="https://123ecommerce.co.za/public/front/images/banner_images/"
            const banners = await Banners.findOne({ where: { id:id, status: 1} });
            
            if(!banners){
                dataNotFound(banners,'Banner Not Found',STATUSCODE.NOT_FOUND);
            }
            const bannerWithFullImagePath = {
                ...banners.dataValues,
                banner_image: `${image_path}${banners.image}`
            };

            return responseGenerator(res,'Banner Fetching Successful',STATUSCODE.OK,bannerWithFullImagePath)
        } catch (error) {
            next(error);
        }
    };

}