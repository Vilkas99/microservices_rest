import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("careers", (table) => {
      table.boolean("doubleDegree");
    })
    .alterTable("subjects", (table) => {
      table.string("englishName");
    })
    .alterTable("notifications", (table) => {
      table.enum("type", [
        "APPOINTMENT_ACCEPTED",
        "APPOINTMENT_REJECTED",
        "APPOINTMENT_COMPLETED",
        "NEW_REQUEST",
        "MESSAGE",
      ]);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("answers");
}
