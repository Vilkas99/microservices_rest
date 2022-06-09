import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("careers", (table) => {
    table.smallint("length").defaultTo(8).checkBetween([1, 16]).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
