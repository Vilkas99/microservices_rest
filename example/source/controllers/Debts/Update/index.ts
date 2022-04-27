import { Request, Response, NextFunction } from "express";
import { getTodayDate } from "../../../utils/functions";


const DebtModel = require('../../../models/Debt')

const payDebt = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.body

    try {
        await DebtModel.query().findById(id).patch({
            status: 'PAYED',
            payment_date: getTodayDate()
        })
        res.send("Ok")
    } catch (error) {
        res.send(error)
    }
}

export default payDebt