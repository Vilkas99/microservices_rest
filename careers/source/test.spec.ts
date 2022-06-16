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

describe("get specific career", () => {
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
          id: "c635f5bd-f41d-44d9-8925-d617cf0e4ea7",
          name: "Licenciatura en Relaciones Internacionales",
          acronym: "LRI",
          doubleDegree: true,
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
  });
  afterAll(() => {
    return knex.migrate.rollback().then(() => knex.destroy());
  });

  test("Get an specific career", async () => {
    await knex
      .select("id", "name", "acronym", "doubleDegree", "length")
      .from("careers")
      .where("id", "0b5d94b7-18bd-4ba4-8ab7-998fe7772c1c")
      .then((data: any) => expect(data[0].acronym).toEqual("ITC"));
  });

  test("Get all double degree careers", async () => {
    await knex
      .select("id", "name", "acronym", "doubleDegree", "length")
      .from("careers")
      .where("doubleDegree", true)
      .then((data: any) =>
        expect(data.map((el: any) => el.acronym)).toEqual(
          expect.arrayContaining(["LRI", "LTP"])
        )
      );
  });
  test("Get all careers", async () => {
    await knex
      .select("id", "name", "acronym", "doubleDegree", "length")
      .from("careers")
      .then((data: any) =>
        expect(data.map((el: any) => el.acronym)).toEqual(
          expect.arrayContaining(["ITC", "LRI", "LTP"])
        )
      );
  });

  test("Create career", async () => {
    await knex("careers")
      .insert([
        {
          id: "b5d8ea78-438e-4096-9699-9265dec94081",
          name: "Ingeniería en Mecatrónica",
          acronym: "IMT",
          doubleDegree: false,
          length: 8,
        },
      ])
      .then(
        async () =>
          await knex
            .select("id", "name", "acronym", "doubleDegree", "length")
            .from("careers")
            .where("id", "b5d8ea78-438e-4096-9699-9265dec94081")
            .then((data: any) => expect(data[0].acronym).toEqual("IMT"))
      );
  });

  test("Update career", async () => {
    await knex("careers")
      .insert([
        {
          id: "8c2fa73f-1bd4-46a4-b239-207687f0c4b7",
          name: "Licenciatura en Negocios Internacionales",
          acronym: "LIN",
          doubleDegree: false,
          length: 8,
        },
      ])
      .then(
        async () =>
          await knex
            .from("careers")
            .where("acronym", "LIN")
            .update({
              name: "Licenciatura en Industria de la Nutrición",
              doubleDegree: true,
              length: 9,
            })
            .then(
              async () =>
                await knex
                  .select("id", "name", "acronym", "doubleDegree", "length")
                  .from("careers")
                  .where("id", "8c2fa73f-1bd4-46a4-b239-207687f0c4b7")
                  .then((data: any) =>
                    expect(data[0].name).toEqual(
                      "Licenciatura en Industria de la Nutrición"
                    )
                  )
            )
      );
  });
});
