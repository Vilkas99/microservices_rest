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

describe("get specific notification", () => {
  beforeAll(async () => {
    await knex.migrate.latest();
    await knex("users")
      .insert([
        {
          id: "1b833f19-0c16-4a19-9008-78268684629e",
          name: "Madre Santísima",
          email: "A01733732@tec.mx",
          password: "123",
          status: "ACTIVE",
          type: "student",
          configuration: { theme: "light", lang: "es" },
        },
      ])
      .returning("*");

    await knex("notifications")
      .insert([
        {
          id: "b07337eb-34f6-414a-90a7-5e49f89f560c",
          title: "Orales",
          description: "Esta es una prueba",
          id_user: "1b833f19-0c16-4a19-9008-78268684629e",
          status: "not seen",
          type: "MESSAGE",
        },
        {
          id: "fa52fdec-0f1d-40ca-966b-ec8992d238d3",
          title: "Nueva Asesoría",
          description: "Esta es una prueba 2",
          id_user: "1b833f19-0c16-4a19-9008-78268684629e",
          status: "seen",
          type: "APPOINTMENT_ACCEPTED",
        },
      ])
      .returning("*");
  });
  afterAll(() => {
    return knex.migrate.rollback().then(() => knex.destroy());
  });

  test("Get notifications of user", async () => {
    await knex
      .select("id", "title", "description")
      .from("notifications")
      .where("id_user", "1b833f19-0c16-4a19-9008-78268684629e")
      .then((data: any) =>
        expect(data.map((el: any) => el.title)).toEqual(
          expect.arrayContaining(["Orales", "Nueva Asesoría"])
        )
      );
  });

  test("Get specific notificacion", async () => {
    await knex
      .select("id", "title", "description")
      .from("notifications")
      .where("id", "b07337eb-34f6-414a-90a7-5e49f89f560c")
      .then((data: any) => expect(data[0].title).toEqual("Orales"));
  });

  test("Create notification", async () => {
    await knex("notifications")
      .insert([
        {
          id: "026ee5bc-0c8c-4e64-9c8a-a2968bf44abb",
          title: "Miau",
          description: "Esta es una prueba 2",
          id_user: "1b833f19-0c16-4a19-9008-78268684629e",
          status: "seen",
          type: "APPOINTMENT_ACCEPTED",
        },
      ])
      .then(
        async () =>
          await knex
            .select("id", "title")
            .from("notifications")
            .where("id", "026ee5bc-0c8c-4e64-9c8a-a2968bf44abb")
            .then((data: any) => expect(data[0].title).toEqual("Miau"))
      );
  });

  test("Update notifications", async () => {
    await knex("notifications")
      .insert([
        {
          id: "d929fb4a-9188-4e2f-9b3b-e8c00ed6fabb",
          title: "Nueva asesoría",
          description: "Esta es una prueba 3",
          id_user: "1b833f19-0c16-4a19-9008-78268684629e",
          status: "not seen",
          type: "APPOINTMENT_ACCEPTED",
        },
      ])
      .then(
        async () =>
          await knex
            .from("notifications")
            .where("id", "d929fb4a-9188-4e2f-9b3b-e8c00ed6fabb")
            .update({
              title: "Asesoría aceptada",
            })
            .then(
              async () =>
                await knex
                  .select("id", "title")
                  .from("notifications")
                  .where("id", "d929fb4a-9188-4e2f-9b3b-e8c00ed6fabb")
                  .then((data: any) =>
                    expect(data[0].title).toEqual("Asesoría aceptada")
                  )
            )
      );
  });
});
