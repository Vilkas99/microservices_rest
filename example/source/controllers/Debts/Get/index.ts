import { Request, Response, NextFunction } from "express";
import { IDebt } from "../../../utils/types/Models";

const DebtModel = require('../../../models/Debt')


const getDebt = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.body

    let debt:IDebt

    try {
        debt = await DebtModel.query().findById(id)
        res.json(debt)
    } catch (error) {
        res.send(error)
    }
}

const getAllDebts = async (req: Request, res: Response, next: NextFunction) => {
    const {from, my_id} = req.body

    let debts:IDebt
    let id_field:string = "id_consultant"

    if(from === "ADMIN"){
        id_field = "id_admin"
    }

    try {
        debts = await DebtModel.query().where({
            debt_from: from,
            [id_field]: my_id
        })
        res.json(debts)
    } catch (error) {
        res.send(error)
    }
}

const getAllPendingPayments = async (req: Request, res: Response, next: NextFunction) => {
    const {from, my_id} = req.body

    let debts:IDebt
    let id_field:string = "id_admin"

    if(from === "ADMIN"){
        id_field = "id_consultant"
    }

    try {
        debts = await DebtModel.query().where({
            debt_from: from,
            [id_field]: my_id
        })
        res.json(debts)
    } catch (error) {
        res.send(error)
    }
}

export {getDebt, getAllDebts, getAllPendingPayments}