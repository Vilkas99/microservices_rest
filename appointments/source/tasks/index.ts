import db from "../db/db";
import { sendEmail } from "../email";
import { appointmentCompletedEmailForAdvisor } from "../email/Templates/Appointment completed/Advisor/template";
import { appointmentCompletedEmailForStudent } from "../email/Templates/Appointment completed/Student/template";

export const markAppointmentsAsCompleted = async () => {
  try {
    const result = await db("appointments")
      .where("status", "ACCEPTED")
      .andWhere("date", "<", new Date(Date.now()))
      .update({ status: "COMPLETED" }, ["id", "id_subject", "date"]);
    for (const updated of result) {
      const subjectName = (
        await db("subjects").first("name").where("id", updated["id_subject"])
      )["name"];
      const ids = await db("appointments-user").first(
        "id_student",
        "id_advisor"
      );
      const studentInfo = await db("users")
        .first("email", "name")
        .where("id", ids["id_student"]);

      const advisorInfo = await db("users")
        .first("email", "name")
        .where("id", ids["id_advisor"]);

      // Email for student

      sendEmail(
        studentInfo["email"],
        "¿Cómo te fue en tu última asesoría?",
        appointmentCompletedEmailForStudent(
          studentInfo["name"],
          subjectName,
          "http://www.paepue.com/dashboard"
        )
      );

      // Email for advisor

      sendEmail(
        advisorInfo["email"],
        "¿Cómo te fue en tu última asesoría?",
        appointmentCompletedEmailForAdvisor(
          advisorInfo["name"],
          subjectName,
          "http://www.paepue.com/dashboard"
        )
      );
    }
    return result;
  } catch (error) {
    return error;
  }
};
