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

describe("Career-Subjects endpoints", () => {
  beforeAll(async () => {
    await knex.migrate.latest();
    await knex("careers")
      .insert([
        {
          id: "0b5d94b7-18bd-4ba4-8ab7-998fe7772c1c",
          name: "Ingeniería en Tecnologías Computacionales",
          acronym: "ITC",
          doubleDegree: false,
          length: 8,
        },
        {
          id: "eb0f7076-7924-47c3-aabb-8d204ebebd06",
          name: "Licenciatura en Gobierno y Transformación Pública",
          acronym: "LTP",
          doubleDegree: true,
          length: 8,
        },
      ])
      .returning("*");

    await knex("subjects")
      .insert([
        {
          id: "3b553f75-936c-4e87-90f3-d05eed2149d3",
          name: "El rol de los negocios en la sociedad",
          acronym: "AD1000B",
          availability: true,
          englishName: "Business Role in Society",
        },
        {
          id: "718d905f-69f1-42ae-befc-bb51bc31c0fb",
          name: "Dirección de los negocios",
          acronym: "AD1014",
          availability: true,
          englishName: "Business Leadership",
        },
      ])
      .returning("*");

    await knex("career-subject")
      .insert([
        {
          id: "224f9f22-f6ee-4092-a63e-ad6ace0d69a3",
          id_career: "0b5d94b7-18bd-4ba4-8ab7-998fe7772c1c",
          id_subject: "3b553f75-936c-4e87-90f3-d05eed2149d3",
          semester: 5,
        },
      ])
      .returning("*");
  });
  afterAll(() => {
    return knex.migrate.rollback().then(() => knex.destroy());
  });

  test("Get a career-subject relation", async () => {
    await knex
      .select("id", "id_career")
      .from("career-subject")
      .where("id", "224f9f22-f6ee-4092-a63e-ad6ace0d69a3")
      .then((data: any) =>
        expect(data[0].id_career).toEqual(
          "0b5d94b7-18bd-4ba4-8ab7-998fe7772c1c"
        )
      );
  });

  test("Create relation career-subject", async () => {
    await knex("career-subject")
      .insert([
        {
          id: "b5d8ea78-438e-4096-9699-9265dec94081",
          id_career: "eb0f7076-7924-47c3-aabb-8d204ebebd06",
          id_subject: "3b553f75-936c-4e87-90f3-d05eed2149d3",
          semester: 5,
        },
      ])
      .then(
        async () =>
          await knex
            .select("id", "id_subject")
            .from("career-subject")
            .where("id", "b5d8ea78-438e-4096-9699-9265dec94081")
            .then((data: any) =>
              expect(data[0].id_subject).toEqual(
                "3b553f75-936c-4e87-90f3-d05eed2149d3"
              )
            )
      );
  });

  test("Update career", async () => {
    await knex("career-subject")
      .insert([
        {
          id: "8c2fa73f-1bd4-46a4-b239-207687f0c4b7",
          id_career: "eb0f7076-7924-47c3-aabb-8d204ebebd06",
          id_subject: "718d905f-69f1-42ae-befc-bb51bc31c0fb",
          semester: 1,
        },
      ])
      .then(
        async () =>
          await knex
            .from("career-subject")
            .where("id", "8c2fa73f-1bd4-46a4-b239-207687f0c4b7")
            .update({
              semester: 2,
            })
            .then(
              async () =>
                await knex
                  .select("id", "semester")
                  .from("career-subject")
                  .where("id", "8c2fa73f-1bd4-46a4-b239-207687f0c4b7")
                  .then((data: any) => expect(data[0].semester).toEqual(2))
            )
      );
  });
});
