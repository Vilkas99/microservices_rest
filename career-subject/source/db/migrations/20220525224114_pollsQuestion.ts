import Knex = require("knex");

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("poll-reports", function (table) {
      table.string("answer").notNullable();
      table.string("question").notNullable();
      table
        .uuid("id_appointment")
        .references("id")
        .inTable("appointments")
        .notNullable();
      table.enum("survey_type", ["advisor", "student"]);
      table.timestamps(true, true);
    })
    .alterTable("questions", (table) => {
      table.enum("type", ["scale", "text", "yesOrNo"]);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("poll-reports")
    .alterTable("questions", (table) => {
      table.dropColumn("type");
    });
}
