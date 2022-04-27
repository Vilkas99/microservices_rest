import { Request, Response, NextFunction } from "express";
import { IModification } from "../../../utils/types/Models";

const ModificationModel = require('../../../models/Modification')

const getModification = async (req:Request, res:Response, next:NextFunction) => {
    const {id} = req.body

    let modification:IModification

    try {
        modification = await ModificationModel.query().findById(id)
        res.json(modification)
    } catch (error) {
        res.send(error)
    }
}


const getAllModifications = async  (req:Request, res:Response, next:NextFunction) => {
    const {id, from} = req.body

    let modifications:IModification[]
    let id_field:string = "id_consultant"

    if(from === "ADMIN"){
        id_field = "id_parent"
    }

    try {
        modifications = await ModificationModel.query().where({
            [id_field]: id
        })
        res.json(modifications)
    } catch (error) {
        res.send(error)
    }
}

export  {getModification, getAllModifications}