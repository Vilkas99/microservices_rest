import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("poll-reports", (table) => {
    table.uuid("id").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
