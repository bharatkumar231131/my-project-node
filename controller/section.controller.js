
import {Sections} from "../models/index.js";
import { dataFound,parameterNotFound, dataNotFound, otpGenerator, responseGenerator } from "../helper/function.helper.js";
import STATUSCODE from "../server/statusCode.js";

import { Op } from "sequelize";

export class SectionController{
    static getAllSection = async (req,res,next) =>{
        try {
            const section= await Sections.findAll({
                where:{deleted_at:null, status: 1}
            });
            return responseGenerator(res,"Section Retrieved Successfully",STATUSCODE.CREATED,section);

        } catch (error) {
            next(error);
        }
    };
    static getSectionById = async(req,res,next)=>{
        const {id}=req.query;
        try {
            const section = await Sections.findOne({ where: { id:id, status: 1} });
            if(!section){
                dataNotFound(section,'Section Not Found',STATUSCODE.NOT_FOUND);
            }

            return responseGenerator(res,'Product Fetching Successful',STATUSCODE.OK,section)
        } catch (error) {
            next(error);
        }
    };

}