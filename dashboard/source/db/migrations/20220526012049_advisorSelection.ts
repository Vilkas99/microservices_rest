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
        AND semester > (SELECT semester FROM subjects WHERE id = NEW.id_subject);

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

export async function up(knex: Knex): Promise<void> {
  return knex.schema
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
    .then(function () {
      return knex.raw(GET_USERT_WEEKLY_CREDITED_HOURS);
    })
    .then(function () {
      return knex.raw(ADD_APPOINTMENT_CANDIDATES);
    })
    .then(function () {
      return knex.raw(APPOINTMENTS_INSERT_TRIGGER);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("appointment-advisorCandidates");
}
