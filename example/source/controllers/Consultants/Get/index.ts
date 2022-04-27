import { Request, Response, NextFunction } from "express";

const ConsultantModel = require("../../../models/Consultant");

const getAllConsultants = async (req:Request, res:Response, next:NextFunction) => {
    const {full, type} = req.body!
    try {
        let consultants:any
        if(full){
            if(type === ""){
                consultants =  await ConsultantModel.query().withGraphFetched("orders").withGraphFetched("modifications").withGraphFetched("debts")
            } else {
                consultants = await ConsultantModel.query().where('type', type).withGraphFetched("orders").withGraphFetched("modifications").withGraphFetched("debts")
            }
            
        } else {
            if(type === ""){
                consultants =  await ConsultantModel.query()
            } else {
                consultants = await ConsultantModel.query().where('type', type)
            }
            
        }
        
        res.json(consultants)
    } catch(error){
        res.send(error)
        console.error(error)
    }
}

const getConsultant = async (req:Request, res:Response, next:NextFunction) => {
    const {id, full} = req.body!
    try {
        let consultant:any

        if(full){
            consultant = await ConsultantModel.query().findById(id).withGraphFetched("orders").withGraphFetched("modifications").withGraphFetched("debts")
        } else {
            consultant = await ConsultantModel.query().findById(id)
        }

        res.json(consultant)
    } catch (error) {
        res.send(error)
        console.error(error)
    }
}



export {getAllConsultants, getConsultant}