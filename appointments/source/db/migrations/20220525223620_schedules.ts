import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasColumn("schedule", "advisor").then((res) => {
    if (res) {
      return; // skip
    }

    return knex.schema.alterTable("schedules", (table) => {
      table.enum("day", ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]);
      table.uuid("advisor").references("id").inTable("users");
      table.timestamp("start");

      table.timestamp("finish");
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("schedules", (table) => {
    table.enum("day", ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]);
    table.uuid("advisor").references("id").inTable("users");
    table.timestamp("start").notNullable().alter();
    table.timestamp("finish").notNullable().alter();
  });
}
