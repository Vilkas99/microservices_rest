import Knex = require("knex");

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasColumn("schedule", "advisor").then((res) => {
    if (res) {
      return; // skip
    }

    knex.schema.alterTable("schedules", (table) => {
      table.enum("day", ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]);
      table.uuid("advisor").references("id").inTable("users");
      table.timestamp("start").notNullable().alter();
      table.timestamp("finish").notNullable().alter();
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.hasColumn("schedule", "advisor").then((res: any) => {});
  return knex.schema.alterTable("schedules", (table: any) => {
    table.dropColumn("advisor");
    table.dropColumn("start");
    table.dropColumn("finish");
  });
}
