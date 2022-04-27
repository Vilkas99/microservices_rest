export enum account_type {
    CONSULTANT = 0,
    DISTRIBUTOR = 1,
    CONSULTANT_NO_RFC = 2,
}

export enum debt_from_type {
    ADMIN = "ADMIN",
    CONSULTANT = "CONSULTANT"
}

export enum debt_type {
    COMMISSION = "COMMISSION",
    CASHBACK = "CASHBACK"
}

export enum parent_type {
    ADMIN = "ADMIN",
    ORDER = "ORDER",
    DEBT = "DEBT"
}

export enum element_type {
    CREDIT = "CREDIT",
    POINTS = "POINTS",
    MONEY = "MONEY",
    PRODUCTS = "PRODUCTS"
}

export enum direct_percentage_type {
    DIST_CON = "DIST_CON", 
    CON_CON  = "CON_CON",
    DIST_DIST = "DIST_DIST"
}

export enum indirect_percentage_type {
    INDIRECT_DIST = "INDIRECT_DIST",
    INDIRECT_LOCATION = "INDIRECT_LOCATION",
    INDIRECT_INDEPENDENT = "INDIRECT_INDEPENDENT"
}

export enum operation_type {
    ADD = "ADD",
    DECREASE = "DECREASE",
    SET = "SET"
}

export enum debt_status {
    PAYED = "PAYED", 
    PENDING = "PENDING"
}

export enum order_status_type {
    PAYED = "PAYED", 
    PENDING = "PENDING",
    CANCELED = "CANCELED"
}

