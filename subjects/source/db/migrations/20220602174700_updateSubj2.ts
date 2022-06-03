import Knex = require("knex");

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("subjects", (table) => {
    table.boolean("optative");
  });
}

export async function down(knex: Knex): Promise<void> {}
