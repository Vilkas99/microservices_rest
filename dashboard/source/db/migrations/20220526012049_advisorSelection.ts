import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    "appointment-advisorCandidates",
    function (table) {
      table
        .uuid("id_appointment")
        .references("id")
        .inTable("appointments")
        .notNullable();
      table.uuid("id_advisor").references("id").inTable("users").notNullable();
      table.enum("status", ["PENDING", "AVILABLE"]).notNullable();
      table.timestamps(true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("appointment-advisorCandidates");
}
