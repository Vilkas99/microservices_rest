import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("career-subject", (table) => {
    table.integer("semester");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("subjects", (table) => {
    table.dropColumn("semester");
  });
}
