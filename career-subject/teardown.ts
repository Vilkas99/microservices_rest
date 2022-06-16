// import * as knex from "knex";
import knex from "knex";

async function deleteDatabase() {
  const dbConnection = knex({
    client: "postgres",
    debug: true,
    connection: {
      host: "localhost",
      port: 5432,
      password: "",
      user: "postgres",
    },
  });

  try {
    await dbConnection.raw("DROP DATABASE IF EXISTS test_database");
  } catch (err) {
    console.log(err);
  } finally {
    await dbConnection.destroy();
  }
}

module.exports = async () => {
  await deleteDatabase();
};
