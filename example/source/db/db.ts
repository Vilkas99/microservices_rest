import knex from "knex";
import { Model } from "objection";
import configs from "./knexfile";

function setupDb() {
    const db = knex(configs);
    Model.knex(db)
}

export default setupDb;