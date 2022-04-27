import { account_type, debt_from_type, debt_status, debt_type, direct_percentage_type, element_type, indirect_percentage_type, operation_type, parent_type, order_status_type } from "../../enums"

interface IAdmin {
    id: string, 
    name: string, 
    last_name: string, 
    mother_last_name: string, 
    total_debt: number,
    total_pending: number
}


interface IConsultant {
    id_consultant: string,
    id_admin: string,
    type: account_type,
    total_pending_payment: number,
    total_debts: number,
    total_products: number,
    current_points: number,
    total_earnings: number,
    name: string,
    last_name: string,
    mother_last_name: string,
}

interface ICredit {
    id: string,
    total: number,
    current: number,
    paymentDate?: Date,
}

interface IDebt {
    id: string,
    id_consultant: string, 
    id_admin: string, 
    amount: number, 
    max_date: Date, 
    payment_date: Date,
    debt_from: debt_from_type, 
    debt_type: debt_type,
    status: debt_status
}

interface IModification {
    id: string,
    id_parent: string, 
    id_consultant: string, 
    parent_type: parent_type,
    operation_type: operation_type,
    element_type: element_type
}

interface IOrder {
    id_order: string, 
    id_consultant: string, 
    total_products: number, 
    total_payment: number, 
    credit: number, 
    points: number, 
    money: number, 
    status: order_status_type,
    purchase_date: Date, 
    purchase_type: Date, 
    products: object, 
    direct_percentage: direct_percentage_type, 
    indirect_percentage: indirect_percentage_type
}

export {IAdmin, IConsultant, ICredit, IDebt, IModification, IOrder}