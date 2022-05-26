import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", function (table) {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.enum("status", ["ACTIVE", "DELETED", "INACTIVE"]).notNullable();
      table.enum("type", ["student", "advisor", "admin", "root"]).notNullable();
      table
        .json("configuration")
        .defaultTo('{"theme":"light","lang":"es"}')
        .notNullable();
      table.timestamps(true, true);
    })
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
      table.timestamps(true, true);
    })
    .createTable("schedules", function (table) {
      table.uuid("id").primary();
      table.date("start");
      table.date("finish");
      table.integer("period");
      table.timestamps(true, true);
    })
    .createTable("careers", function (table) {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("acronym").unique().notNullable();
      table.timestamps(true, true);
    })
    .createTable("subjects", function (table) {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("acronym").unique().notNullable();
      table.integer("semester").notNullable();
      table.boolean("availability").notNullable();
      table.timestamps(true, true);
    })
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
    .createTable("questions", function (table) {
      table.uuid("id").primary();
      table.string("title").notNullable();
      table.enum("type", ["scale", "text", "boolean"]);
      table.integer("order").notNullable();
      table.enum("survey_type", ["advisor", "student"]);
      table.timestamps(true, true);
    })
    .createTable("answers", function (table) {
      table.uuid("id").primary();
      table.string("text").notNullable();
      table
        .uuid("id_appointment")
        .references("id")
        .inTable("appointments")
        .notNullable();
      table
        .uuid("id_question")
        .references("id")
        .inTable("questions")
        .notNullable();
      table.timestamps(true, true);
    })
    .createTable("career-subject", function (table) {
      table.uuid("id").primary();
      table.uuid("id_career").references("id").inTable("careers");
      table.uuid("id_subject").references("id").inTable("subjects");
      table.timestamps(true, true);
    })
    .createTable("users-career", function (table) {
      table.uuid("id").primary();
      table.uuid("id_user").references("id").inTable("users");
      table.uuid("id_career").references("id").inTable("careers");
      table.integer("semester").notNullable;
      table.timestamps(true, true);
    })
    .createTable("users-schedule", function (table) {
      table.uuid("id").primary();
      table.uuid("id_user").references("id").inTable("users");
      table.uuid("id_schedule").references("id").inTable("schedules");
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("career-subject")
    .dropTable("users-career")
    .dropTable("users-schedule")
    .dropTable("appointments-user")
    .dropTable("notifications")
    .dropTable("answers")
    .dropTable("users")
    .dropTable("schedules")
    .dropTable("appointments")
    .dropTable("careers")
    .dropTable("subjects")
    .dropTable("questions");
}
