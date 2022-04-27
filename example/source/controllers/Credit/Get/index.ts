import { Request, Response, NextFunction } from "express";

const CreditModel = require('../../../models/Credit')

const getCredit = async (req:Request, res:Response, next:NextFunction) => {
    const {id_distributor} = req.body

    let credit:any

    try {
        credit = await CreditModel.query().where('id_distributor', id_distributor)
    } catch (error) {
        res.send(error)
    }

    res.json(credit)
}

const getAllCredits = async (req:Request, res:Response, next:NextFunction) => {
    
    let credits:any

    try {
        credits = await CreditModel.query()
    } catch (error) {
        res.send(error)
    }

    res.send(credits)
}


export {getCredit, getAllCredits}