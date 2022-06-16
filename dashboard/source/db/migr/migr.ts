import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  knex.schema
    .createTable("careers", (table) => {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("acronym").unique().notNullable();
      table.boolean("doubleDegree");
      table.integer("length");
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("users", function (table) {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.enum("status", ["ACTIVE", "DELETED", "INACTIVE"]).notNullable();
      table.enum("type", ["student", "advisor", "admin", "root"]).notNullable();
      table.json("configuration");
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("notifications", function (table) {
      table.uuid("id").primary();
      table
        .uuid("id_user")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("title").notNullable();
      table.string("description").notNullable();
      table.enum("status", ["seen", "not seen", "deleted"]).notNullable();
      table.enum("type", [
        "APPOINTMENT_ACCEPTED",
        "APPOINTMENT_REJECTED",
        "APPOINTMENT_COMPLETED",
        "NEW_REQUEST",
        "MESSAGE",
      ]);
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("schedules", function (table) {
      table.uuid("id").primary();
      table.integer("period").notNullable();
      table.enum("day", ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]);
      table.uuid("advisor").references("id").inTable("users");
      table.timestamp("start").notNullable();
      table.timestamp("finish").notNullable();
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("subjects", function (table) {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("acronym").unique().notNullable();
      table.boolean("availability").notNullable();
      table.string("englishName");
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("appointments", function (table) {
      table.uuid("id").primary();
      table.timestamp("date").notNullable();
      table
        .uuid("id_subject")
        .references("id")
        .inTable("subjects")
        .notNullable();
      table
        .enum("status", ["PENDING", "ACCEPTED", "COMPLETED", "CANCELED"])
        .notNullable();
      table.string("location").notNullable();
      table.string("problem_description").notNullable();
      table.string("photo_url").notNullable();
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("appointments-user", function (table) {
      table.uuid("id").primary();
      table
        .uuid("id_appointment")
        .references("id")
        .inTable("appointments")
        .onDelete("SET NULL");
      table
        .uuid("id_student")
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");
      table
        .uuid("id_advisor")
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");
      table
        .uuid("id_admin")
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("questions", function (table) {
      table.uuid("id").primary();
      table.string("title").notNullable();
      table.integer("order").notNullable();
      table.enum("survey_type", ["advisor", "student"]);
      table.enum("type", ["scale", "text", "yesOrNo"]);
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("career-subject", function (table) {
      table.uuid("id").primary();
      table.uuid("id_career").references("id").inTable("careers");
      table.uuid("id_subject").references("id").inTable("subjects");
      table.integer("semester");
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("users-career", function (table) {
      table.uuid("id").primary();
      table.uuid("id_user").references("id").inTable("users");
      table.uuid("id_career").references("id").inTable("careers");
      table.integer("semester").notNullable;
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("poll-reports", function (table) {
      table.uuid("id").notNullable();
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
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("appointment-advisorCandidates", function (table) {
      table
        .uuid("id_appointment")
        .references("id")
        .inTable("appointments")
        .notNullable();
      table.uuid("id_advisor").references("id").inTable("users").notNullable();
      table.enum("status", ["PENDING", "AVILABLE"]).notNullable();
      table.timestamps(true, true);
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("current_period", function (table) {
      table.boolean("id").primary().defaultTo(true);
      table.integer("period").notNullable();
    })
    .then(() => console.log("Table created"));
  knex.schema
    .createTable("emailVerifications", function (table) {
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
    })
    .then(() => console.log("Tables created"));
  // more tables
}

export async function down(knex: Knex): Promise<any> {
  return () => knex.schema.dropTable("career-subject");
  knex.schema.dropTable("users-career");
  knex.schema.dropTable("appointments-user");
  knex.schema.dropTable("notifications");
  knex.schema.dropTable("answers");
  knex.schema.dropTable("users");
  knex.schema.dropTable("schedules");
  knex.schema.dropTable("appointments");
  knex.schema.dropTable("careers");
  knex.schema.dropTable("subjects");
  knex.schema.dropTable("questions");
  knex.schema.dropTable("emailVerifications");
  knex.schema.dropTable("current_period");
  knex.schema.dropTable("appointment-advisorCandidates");
}
