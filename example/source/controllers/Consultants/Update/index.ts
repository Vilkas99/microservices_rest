import { Request, Response, NextFunction } from "express";

import { INumberModification, IUpdateConsultant } from "../../../utils/types/Request";

import { element_type, operation_type, parent_type } from "../../../utils/enums"
import { raw } from "objection";
import { ICreateModification } from "../../../utils/types";
import { createModification } from "../../../utils/functions";

const ConsultantModel = require("../../../models/Consultant");


const getTypeElement = (field:string):element_type => {
    switch (field) {        
        case "total_products": 
            return element_type.PRODUCTS
        
        case "current_points": 
            return element_type.POINTS

        default:
            return element_type.MONEY;
    }
}


const UpdateConsulant = async  (req:Request, res:Response, next:NextFunction) => {
    const {my_id, id, values}:IUpdateConsultant = req.body
    
    const keys = ["id_admin", "total_pending_payment", "total_debts", "total_products", "current_points", "total_earnings", "name", "last_name", "mother_last_name"]
    const keys_transaction = ["total_pending_payment", "total_debts", "total_products", "current_points", "total_earnings"]


    keys.forEach(async (key) => {
        if(!(key in values)){
            return
        }        
        try {
            if(keys_transaction.includes(key)){
                try {
                    await ConsultantModel.transaction(async (trx: any) => {
                        const number_value = values[key] as INumberModification
    
                        switch (number_value.type) {
                            case operation_type.ADD :
                                await ConsultantModel.query(trx).findById(id).patch({
                                    [key]: raw(`${key} + ${number_value.value}`)
                                })                        
                                break;
                            
                            case operation_type.SET: 
                                await ConsultantModel.query(trx).findById(id).patch({
                                    [key]: number_value.value
                                })
                                break
                            
                            case operation_type.DECREASE: 
                                await ConsultantModel.query(trx).findById(id).patch({
                                    [key]: raw(`${key} - ${number_value.value}`)
                                })
                                break
    
                            default:
                                res.send(`404 - ${number_value.type} was not found in regular types of operations.`)
                                break;
                        }
                        
                        const params_create_modification:ICreateModification = {
                            id_consultant: id, 
                            id_parent: my_id, 
                            operation_type: number_value.type,
                            element_type: getTypeElement(key),
                            parent_type: parent_type.ADMIN,
                            res
                        }

                        await createModification(params_create_modification)
                    })
                } catch (error) {
                    res.send(error)
                }
            } else {
                await ConsultantModel.query().findById(id).patch({
                    [key]: values[key]
                })
            }
        } catch (error) {
            res.send(error)
        }        
    })

    res.send("Ok")
}

export {UpdateConsulant}