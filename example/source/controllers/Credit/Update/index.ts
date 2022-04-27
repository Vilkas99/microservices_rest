import { Request, Response, NextFunction } from "express";
import { raw } from "objection";

import { element_type, operation_type, parent_type } from "../../../utils/enums";
import { createModification } from "../../../utils/functions";
import { ICreateModification } from "../../../utils/types";

import { INumberModification } from "../../../utils/types/Request";

const CreditModel = require("../../../models/Credit")

const UpdateCredit = async  (req:Request, res:Response, next:NextFunction) => {
    const {my_id, id_distributor, values} = req.body

    const fields = ["total", "current", "payment_date"]
    const fields_transaction = ["total", "current"]
    const error = false

    fields.forEach((field) => {
        if(!(field in values)){
            return
        }

        if(fields_transaction.includes(field)){
            try {
                CreditModel.transaction(async (trx:any) => {
                    const number_value:INumberModification = values[field]

                    switch (number_value.type) {                   
                        case operation_type.ADD:
                            if(number_value.value < 0){
                                res.send("Negative values are not allowed for 'ADD' operations")
                                return
                            }
        
                            await CreditModel.query(trx).where('id_distributor', id_distributor).patch({
                                [field]: raw(`${field} + ${number_value.value}`)
                            })    
                            break;
                        
                        case operation_type.DECREASE:
                            await CreditModel.query(trx).where('id_distributor', id_distributor).patch({
                                [field]: raw(`${field} - ${number_value.value}`)
                            })    
                            break;
                    
                        default:
                            await CreditModel.query(trx).where('id_distributor', id_distributor).patch({
                                [field]: number_value.value
                            })                                
                            break;
                    }

                   const params_create_modification:ICreateModification = {
                        id_consultant: id_distributor, 
                        id_parent: my_id, 
                        operation_type: number_value.type,
                        element_type: element_type.CREDIT, 
                        parent_type: parent_type.ADMIN,
                        res
                    }
                    
                    createModification(params_create_modification)
                })
            } catch (error) {
                res.send(error)
                error = true    
            }
        }

        else {
            try {
                CreditModel.query().where('id_distributor').patch({
                    [field]: values[field]
                })
            } catch (error) {
                res.send(error)
                error = true
            }
        }
    })

    if(!error){
        res.send("Ok")
    }
}

export {UpdateCredit}