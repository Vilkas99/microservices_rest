import { Request, Response, NextFunction } from "express";

const AdminModel = require("../../../models/Admin");

const getAllAdmins = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const admins:any = await AdminModel.query()
        res.json(admins)
    } catch(error){
        res.send(error)
        console.error("Error: ", error)
    }
}

const getAdmin = async (req:Request, res:Response, next:NextFunction) => {
    const {id, full} = req.body!
    
    try {
        let admin:any

        if(full){
            admin = await AdminModel.query().findById(id).withGraphFetched("consultants").withGraphFetched("debts")
        } else {
            admin = await AdminModel.query().findById(id)
        }

        res.json(admin)
    } catch (error) {
        res.send(error)
        console.error(error)
    }
}


export {getAllAdmins, getAdmin}