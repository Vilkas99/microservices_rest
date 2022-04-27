import { Request, Response, NextFunction } from "express";

const DebtModel = require('../../../models/Debt')

const deleteDebt = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.body

    try {
        await DebtModel.query().deleteById(id)
    } catch (error) {
        res.send(error)
    }

    res.send("Ok")
}

export default deleteDebt