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

describe("get specific subject", () => {
  beforeAll(async () => {
    await knex.migrate.latest();
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
  });
  afterAll(() => {
    return knex.migrate.rollback().then(() => knex.destroy());
  });

  test("Get an specific subject", async () => {
    await knex
      .select("id", "name", "acronym", "availability", "englishName")
      .from("subjects")
      .where("id", "3b553f75-936c-4e87-90f3-d05eed2149d3")
      .then((data: any) => expect(data[0].acronym).toEqual("AD1000B"));
  });

  test("Create subject", async () => {
    await knex("subjects")
      .insert([
        {
          id: "3ba6cb67-d601-471c-b47f-b4a3aa2718c9",
          name: "Análisis financiero",
          acronym: "CF1015",
          availability: true,
          englishName: "Financial Analysis",
        },
      ])
      .then(
        async () =>
          await knex
            .select("id", "name", "acronym", "availability", "englishName")
            .from("subjects")
            .where("id", "3ba6cb67-d601-471c-b47f-b4a3aa2718c9")
            .then((data: any) => expect(data[0].acronym).toEqual("CF1015"))
      );
  });

  test("Update subject", async () => {
    await knex("subjects")
      .insert([
        {
          id: "cea580b5-20b8-47db-9901-59b5b59fc4bf",
          name: "Economía empresarial",
          acronym: "EC1017",
          availability: true,
          englishName: "Enterprise Economy",
        },
      ])
      .then(
        async () =>
          await knex
            .from("subjects")
            .where("id", "cea580b5-20b8-47db-9901-59b5b59fc4bf")
            .update({
              name: "Emprendimiento empatizador",
              acronym: "EC1017",
              availability: true,
              englishName: "Empathized entrepreneurship",
            })
            .then(
              async () =>
                await knex
                  .select(
                    "id",
                    "name",
                    "acronym",
                    "availability",
                    "englishName"
                  )
                  .from("subjects")
                  .where("id", "cea580b5-20b8-47db-9901-59b5b59fc4bf")
                  .then((data: any) =>
                    expect(data[0].name).toEqual("Emprendimiento empatizador")
                  )
            )
      );
  });
});
