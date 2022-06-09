import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("emailVerifications", function (table) {
    table.uuid("id").primary();
    table
      .uuid("id_user")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNullable();
    table.string("token").notNullable();
    table
      .enum("status", ["PENDING", "VERIFIED"])
      .defaultTo("PENDING")
      .notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable("emailVerifications");
}
