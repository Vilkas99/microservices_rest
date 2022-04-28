require("dotenv").config();

const configs = {
  client: "pg",
  connection: {
    host: process.env.POSTGRESS_URL as string,
    port: process.env.POSTGRESS_PORT as string,
    user: process.env.POSTGRESS_USER as string,
    password: process.env.POSTGRESS_PASSWORD as string,
    database: process.env.POSTGRESS_DB as string,
    ssl: { rejectUnauthorized: false },
  },
  migrations: {
    tableName: "PAE",
    directory: __dirname + "/source/db/migrations",
  },
  seeds: {
    directory: __dirname + "/source/db/seeds",
  },
};

export default configs;
