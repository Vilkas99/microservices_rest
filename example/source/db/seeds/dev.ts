import { Knex } from "knex";

import { uuid } from 'uuidv4';
import { uniqueNamesGenerator, names, NumberDictionary, animals } from 'unique-names-generator';

import { getRandomInt } from "../../utils/functions";

let DateGenerator = require('random-date-generator');

const randomProducts = ():Object => {
    let products:any = {}
    
    for(let i = 0; i < getRandomInt(50); i++){
        products[`product ${i}`] = uniqueNamesGenerator({dictionaries: [animals]})
    }
    return products
}


export async function seed(knex: Knex): Promise<void> {
    //Truncate all existing tables
    await knex.raw('TRUNCATE TABLE "administrators" CASCADE');
    await knex.raw('TRUNCATE TABLE "consultants" CASCADE');
    await knex.raw('TRUNCATE TABLE "credit" CASCADE');
    await knex.raw('TRUNCATE TABLE "debts" CASCADE');
    await knex.raw('TRUNCATE TABLE "modifications" CASCADE');
    await knex.raw('TRUNCATE TABLE "orders" CASCADE');

    // Inserts seed entries

    //We save all the ids into arrays, to use them in the creation of entries.
    let ids_admins:string[] = [];
    let ids_consultants:string[] = [];
    let ids_distributors:string[] = [];

    //Create Admins.
    for(let i = 0; i < 5; i++){
        
        const id_admin = uuid()

        //We add them into arrays for future use.
        ids_admins.push(id_admin)

        await knex("administrators").insert([
            { 
                id: id_admin, 
                name: uniqueNamesGenerator({
                    dictionaries: [names]
                }), 
                last_name: uniqueNamesGenerator({
                    dictionaries: [names]
                }), 
                mother_last_name: uniqueNamesGenerator({
                    dictionaries: [names]
                }),
                total_debt:getRandomInt(1000),
                total_pending: getRandomInt(1000)
            }
        ]);
    }

    //Create Consultants.
    for(let i = 0; i < 5; i++) {

        const types = ["CONSULTANT", "DISTRIBUTOR", "CONSULTANT_NO_RFC"]

        const id = uuid()
        ids_consultants.push(id)

        const type = types[getRandomInt(types.length)]
        if(type === "DISTRIBUTOR"){
            ids_distributors.push(id)
        }

        await knex("consultants").insert([
            { 
                id,
                id_admin: ids_admins[getRandomInt(ids_admins.length)],
                type,
                name: uniqueNamesGenerator({
                    dictionaries: [names]
                }), 
                last_name: uniqueNamesGenerator({
                    dictionaries: [names]
                }), 
                mother_last_name: uniqueNamesGenerator({
                    dictionaries: [names]
                }),
                total_debts: getRandomInt(1000),
                total_pending_payment: getRandomInt(1000),
                total_products: getRandomInt(1000),
                total_earnings: getRandomInt(1000),
                current_points: getRandomInt(1000)
            }
        ]);
    }

    //Debts
    for(let i = 0; i < 5; i++){

        const from_types:String[] = ["ADMIN", "CONSULTANT"]
        const debt_types:String[] = ["COMMISSION", "CASHBACK"]
        const stauts_types:String[] = ["PAYED", "PENDING"]

        const status = stauts_types[getRandomInt(2)]
        
        let payment_date:Date|null = null

        if(status === "PAYED") {
            payment_date = DateGenerator.getRandomDate()
        }

        await knex('debts').insert({
            id: uuid(),
            id_consultant: ids_consultants[getRandomInt(ids_consultants.length)],
            id_admin: ids_admins[getRandomInt(ids_admins.length)],
            amount: getRandomInt(1000),
            payment_date,
            max_date: DateGenerator.getRandomDate(),
            debt_from: from_types[getRandomInt(2)],
            debt_type: debt_types[getRandomInt(2)],
            status
        })
    }

    //Modifications
    for(let i = 0; i < 5; i++){
        
        const parent_types:string[]  = ["ADMIN", "ORDER", "DEBT"]
        const operation_types:string[] = ["ADD", "DECREASE", "SET"]
        const element_types:String[] = ["CREDIT", "POINTS", "MONEY"]

        await knex('modifications').insert({
            id: uuid(),
            id_parent: ids_admins[getRandomInt(ids_admins.length)],
            id_consultant: ids_consultants[getRandomInt(ids_consultants.length)],
            parent_type: parent_types[getRandomInt(3)],
            operation_type: operation_types[getRandomInt(2)],
            element_type: element_types[getRandomInt(3)]
        })
    }


    //Credit 
    for(let i = 0; i < ids_distributors.length; i++){
        let ids_visited:string[] = []
        let id_distributor:string
        
        do {
            id_distributor = ids_distributors[getRandomInt(ids_distributors.length)]
        } while(ids_visited.includes(id_distributor))

        ids_visited.push(id_distributor)

        await knex('credit').insert({
            id: uuid(),
            id_distributor,
            payment_date: DateGenerator.getRandomDate(),
            total: getRandomInt(1000),
            current: getRandomInt(500)
        })
    }


    //Orders
    for(let i = 0; i < 5; i++){
        
        const purchase_types:string[]  = ["PERSONAL", "SELLING"]
        const direct_types:string[] = ["DIST_CON", "CON_CON", "DIST_DIST"]
        const indirect_types:String[] =  ["INDIRECT_DIST", "INDIRECT_LOCATION", "INDIRECT_INDEPENDENT"]
        const status_types:String[] = ["PAYED", "PENDING", "CANCELED"]

        await knex('orders').insert({
            id: uuid(),
            id_consultant: ids_consultants[getRandomInt(ids_consultants.length)],
            total_products: getRandomInt(1000), 
            total_payment: getRandomInt(1000),
            credit: getRandomInt(1000),
            points: getRandomInt(1000),
            money: getRandomInt(1000),
            purchase_date: DateGenerator.getRandomDate(),
            purchase_type: purchase_types[getRandomInt(purchase_types.length)],
            products: randomProducts(),
            direct_percentage: direct_types[getRandomInt(direct_types.length)],
            indirect_percentage: indirect_types[getRandomInt(indirect_types.length)],
            status: status_types[getRandomInt(status_types.length)]
        })
    }
    
    return
};
