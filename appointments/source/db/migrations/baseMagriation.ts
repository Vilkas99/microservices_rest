import { Knex } from "knex";

const ADD_APPOINTMENT_CANDIDATES = `CREATE OR REPLACE FUNCTION add_appointment_candidates()
RETURNS trigger
AS
$$
BEGIN
 
   WITH DayOfWeekES (dayOfWeek, day) AS
   ( SELECT dayOfWeek, day
       FROM ( VALUES ('Domingo', 0),
                     ('Lunes', 1),
                     ('Martes', 2),
                     ('Miércoles', 3),
                     ('Jueves', 4),
                     ('Viernes', 5),
                     ('Sábado', 6) )
            AS DayOfWeekES(dayOfWeek, day) )
 
   INSERT INTO "appointment-advisorCandidates"("id_appointment", "id_advisor", "status")
       SELECT NEW.id, id_user, 'PENDING'
       FROM "users-career"
       WHERE id_career IN (SELECT id_career FROM "career-subject" WHERE id_subject = NEW.id_subject)
       AND get_user_weekly_credited_hours(id_user) < 5
       AND id_user IN (SELECT advisor
                 FROM schedules
                 WHERE NEW.date::time >= start::time AND NEW.date::time <= finish::time
                           AND day = (SELECT dayOfWeek FROM DayOfWeekES WHERE day = EXTRACT(dow FROM NEW.date))
                 AND period = (SELECT period FROM current_period))
       AND semester > (SELECT semester
                       FROM "career-subject"
                       WHERE id_subject = NEW.id_subject
                       AND "career-subject".id_career = "users-career".id_career);
 
   RETURN NEW;
 
END; 
$$
LANGUAGE 'plpgsql';`;

const GET_USERT_WEEKLY_CREDITED_HOURS = `CREATE OR REPLACE FUNCTION get_user_weekly_credited_hours(user_id uuid)
RETURNS int
LANGUAGE plpgsql
AS
$$
DECLARE
   credited_hours_count integer;
BEGIN
   SELECT COUNT(*)
   INTO credited_hours_count
   FROM "appointments"
   LEFT JOIN "appointments-user"
   ON appointments.id = "appointments-user".id_appointment
   WHERE status = 'COMPLETED'
   AND id_advisor = user_id
   AND appointments.date BETWEEN (SELECT date_trunc('week', current_date)) AND current_date;
 
   RETURN credited_hours_count;
END;
$$;
`;

const APPOINTMENTS_INSERT_TRIGGER = `CREATE TRIGGER appointments_insert_trigger
AFTER INSERT
ON "appointments"
FOR EACH ROW
EXECUTE PROCEDURE add_appointment_candidates();`;

const CREATE_SURVEY_NOTIFICATION = `CREATE OR REPLACE FUNCTION create_survey_notification()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
 
IF NEW.status = 'COMPLETED' then
   INSERT INTO "notifications"("id", "id_user", "title", "description", "status")
    SELECT gen_random_uuid(), id_student, 'survey', id_appointment, 'not seen'
    FROM "appointments-user"
    WHERE id_appointment = NEW.id;
  INSERT INTO "notifications"("id", "id_user", "title", "description", "status")
    SELECT gen_random_uuid(), id_advisor, 'survey', id_appointment, 'not seen'
    FROM "appointments-user"
    WHERE id_appointment = NEW.id;
 
END IF;
  RETURN NEW;
 
END; 
$function$`;
const UPDATE_APPOINTMENT_STATUS_TRIGGER = `CREATE OR REPLACE TRIGGER update_appointment_status_trigger
AFTER UPDATE OF status ON appointments
FOR EACH ROW
EXECUTE PROCEDURE create_survey_notification();`;
const CREATE_APPOINTMENT_CANDIDATE_NOTIFICATION = `CREATE OR REPLACE FUNCTION create_appointment_candidate_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
BEGIN
 
  INSERT INTO "notifications"("id", "id_user", "title", "description", "status")
  VALUES(gen_random_uuid(), NEW.id_advisor, 'selectedForAppointment', NEW.id_appointment, 'not seen');
 
   RETURN NEW;
 
END; 
$function$`;
const CREATE_APPOINTMENT_CANDIDATES_TRIGGER = `CREATE OR REPLACE TRIGGER create_appointment_canidates_trigger
AFTER INSERT ON "appointment-advisorCandidates"
FOR EACH ROW
EXECUTE PROCEDURE create_appointment_candidate_notification();`;

export async function up(knex: Knex): Promise<void> {
  return knex.schema
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
    .createTable("schedules", function (table) {
      table.uuid("id").primary();
      table.enum("day", ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]);
      table.uuid("advisor").references("id").inTable("users");
      table.timestamp("start").notNullable().alter();
      table.timestamp("finish").notNullable().alter();
      table.timestamps(true, true);
    })
    .createTable("careers", function (table) {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("acronym").unique().notNullable();
      table.boolean("doubleDegree");
      table.timestamps(true, true);
    })
    .createTable("subjects", function (table) {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("englishName");
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
      table.enum("type", ["scale", "text", "yesOrNo"]);
      table.integer("order").notNullable();
      table.enum("survey_type", ["advisor", "student"]);
      table.timestamps(true, true);
    })
    .createTable("career-subject", function (table) {
      table.uuid("id").primary();
      table.uuid("id_career").references("id").inTable("careers");
      table.uuid("id_subject").references("id").inTable("subjects");
      table.integer("semester");
      table.timestamps(true, true);
    })
    .createTable("users-career", function (table) {
      table.uuid("id").primary();
      table.uuid("id_user").references("id").inTable("users");
      table.uuid("id_career").references("id").inTable("careers");
      table.integer("semester").notNullable;
      table.timestamps(true, true);
    })
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
    .createTable("current_period", function (table) {
      table.boolean("id").primary().defaultTo(true);
      table.smallint("period").notNullable();
      table.check("??", ["id"], "unique_entry_check");
      table.check(
        "?? >= 1 AND ?? <= 3",
        ["period", "period"],
        "valid_period_check"
      );
    })
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
    .createTable("period", function (table) {
      table.boolean("id").primary().defaultTo(true).checkPositive();
      table.smallint("current").defaultTo(1);
    })
    .then(function () {
      return knex.raw(GET_USERT_WEEKLY_CREDITED_HOURS);
    })
    .then(function () {
      return knex.raw(ADD_APPOINTMENT_CANDIDATES);
    })
    .then(function () {
      return knex.raw(APPOINTMENTS_INSERT_TRIGGER);
    })
    .then(function () {
      return knex.raw(UPDATE_APPOINTMENT_STATUS_TRIGGER);
    })
    .then(function () {
      return knex.raw(CREATE_APPOINTMENT_CANDIDATE_NOTIFICATION);
    })
    .then(function () {
      return knex.raw(CREATE_APPOINTMENT_CANDIDATES_TRIGGER);
    })
    .then(function () {
      return knex.raw(CREATE_SURVEY_NOTIFICATION);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("career-subject")
    .dropTable("users-career")
    .dropTable("appointments-user")
    .dropTable("notifications")
    .dropTable("answers")
    .dropTable("users")
    .dropTable("schedules")
    .dropTable("appointments")
    .dropTable("careers")
    .dropTable("subjects")
    .dropTable("questions")
    .dropTable("emailVerifications")
    .dropTable("current_period")
    .dropTable("appointment-advisorCandidates")
    .dropTable("poll-reports");
}
