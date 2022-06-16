// import {};
export {};

const config = {
  client: "postgres",
  debug: true,
  connection: {
    host: "localhost",
    database: "test_database",
    port: "5432",
    password: "",
    user: "postgres",
  },
  migrations: {
    directory: "./source/db/migr",
    // tableName: "PAE",
    // extension: "ts",
  },
};

const knex = require("knex")(config);
// import { getCareerQuery } from "./queries";

describe("Endpoints users", () => {
  beforeAll(async () => {
    await knex.migrate.latest();
    await knex("users")
      .insert([
        {
          id: "1b833f19-0c16-4a19-9008-78268684629e",
          name: "Mi bebé preciosa y hermosa <3",
          email: "A01733732@tec.mx",
          password: "123",
          status: "ACTIVE",
          type: "student",
        },
      ])
      .returning("*");
  });
  afterAll(() => {
    return knex.migrate.rollback().then(() => knex.destroy());
  });

  test("Get user", async () => {
    await knex
      .select("id", "name")
      .from("users")
      .where("id", "1b833f19-0c16-4a19-9008-78268684629e")
      .then((data: any) =>
        expect(data[0].name).toEqual("Mi bebé preciosa y hermosa <3")
      );
  });

  test("Create user", async () => {
    await knex("users")
      .insert([
        {
          id: "15137d2c-fea3-4b66-bcff-488be329dce1",
          name: "El Asesor de Asesores",
          email: "A01733769@tec.mx",
          password: "123",
          status: "ACTIVE",
          type: "admin",
        },
      ])
      .then(
        async () =>
          await knex
            .select("id", "name")
            .from("users")
            .where("id", "15137d2c-fea3-4b66-bcff-488be329dce1")
            .then((data: any) =>
              expect(data[0].name).toEqual("El Asesor de Asesores")
            )
      );
  });

  test("Update users", async () => {
    await knex("users")
      .insert([
        {
          id: "14cabfdc-f847-4959-b7bf-a40aca8ff7f3",
          name: "David Bowie",
          email: "A01740000@tec.mx",
          password: "123",
          status: "ACTIVE",
          type: "root",
        },
      ])
      .then(
        async () =>
          await knex
            .from("users")
            .where("id", "14cabfdc-f847-4959-b7bf-a40aca8ff7f3")
            .update({
              name: "Señor Malvi",
            })
            .then(
              async () =>
                await knex
                  .select("id", "name")
                  .from("users")
                  .where("id", "14cabfdc-f847-4959-b7bf-a40aca8ff7f3")
                  .then((data: any) =>
                    expect(data[0].name).toEqual("Señor Malvi")
                  )
            )
      );
  });
});
