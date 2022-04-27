
import { uuid } from "uuidv4";

import { ICreateModification } from "../../utils/types";
const ModificationModel = require("../../models/Modification")

const createModification = async (params:ICreateModification ) => {
    const {id_consultant, id_parent, operation_type, parent_type, element_type, res} = params

    const id = uuid()

    try {
        await ModificationModel.query().insert({
            id,
            id_consultant,
            id_parent,
            operation_type,
            parent_type,
            element_type
        })
    } catch (error) {
        console.log("Error: ", error)
    }    
}

const getRandomInt = (max:number) => {
    return Math.floor(Math.random() * max);
}

const getTodayDate = () => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    let result = mm + '/' + dd + '/' + yyyy;
    return result
}

export {getRandomInt, createModification, getTodayDate}

