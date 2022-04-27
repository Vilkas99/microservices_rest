import { account_type, operation_type } from "../../enums"

export interface INumberModification {
    value: number, 
    type: operation_type
}

interface IUpdateConsultantFields {
    [key:string]: string|number|INumberModification
}

export interface IUpdateConsultant {
    my_id: string,
    id: string, 
    values: IUpdateConsultantFields
}

interface IUpdateCreditFields {
    [key:string]: string | INumberModification | Date
}

export interface IUpdateCredt {
    my_id: string
    id_distributor: string
    values: IUpdateConsultantFields
}