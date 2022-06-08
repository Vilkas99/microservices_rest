import { Knex } from "knex";

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
  return knex
    .raw(CREATE_SURVEY_NOTIFICATION)
    .then(function () {
      return knex.raw(UPDATE_APPOINTMENT_STATUS_TRIGGER);
    })
    .then(function () {
      return knex.raw(CREATE_APPOINTMENT_CANDIDATE_NOTIFICATION);
    })
    .then(function () {
      return knex.raw(CREATE_APPOINTMENT_CANDIDATES_TRIGGER);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex
    .raw(`DROP TRIGGER update_appointment_status_trigger ON appointment`)
    .then(function () {
      return knex.raw(
        `DROP TRIGGER create_appointment_canidates_trigger ON "appointment-advisorCandidates"`
      );
    });
}
