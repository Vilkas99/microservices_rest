// import * as knex from "knex";
import knex from "knex";

// import knex = require("knex");

function getDbConnection() {
  return knex({
    client: "postgres",
    debug: true,
    connection: {
      host: "localhost",
      port: 5432,
      password: "",
      user: "postgres",
    },
  });
}

async function createDatabase() {
  const dbConnection = getDbConnection();

  try {
    await dbConnection.raw("CREATE DATABASE test_database");
  } catch (err) {
    console.log(err);
  } finally {
    await dbConnection.destroy();
  }
}

module.exports = async () => {
  await createDatabase();
};
