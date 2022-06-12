import { eachHourOfInterval } from "date-fns";
import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";
import { sendEmail } from "../../../email";
import { appointmentCancelledEmail } from "../../../email/Templates/Appointment cancelled/template";
import { confirmedAppointmentEmailForAdvisor } from "../../../email/Templates/Appointment confirmed/Advisor/template";
import { ENotificationType } from "../../../utils/enums";
import { createNotification } from "../../../utils/functions";

enum EStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

enum ECandidateStatus {
  PENDING = "PENDING",
  AVILABLE = "AVILABLE",
  REJECTED = "REJECTED",
}

interface IIdsAppointmentDataMod {
  id_advisor?: string;
  id_admin?: string;
}

interface IBaseChanges {
  date?: string | Date;
  id_subject?: string;
  status?: EStatus;
  location?: string;
  problem_description?: string;
  photo_url?: string;
}

interface IUpdateaAppointment {
  id: string;
  idStudent: string;
  baseChanges: IBaseChanges;
  detailChanges: IIdsAppointmentDataMod;
}

interface IUpdateaCandidate {
  idAppointment: string;
  idAdvisor: string;
  newState: ECandidateStatus;
}

const notificationForStudent = async (
  baseChanges: IBaseChanges,
  idStudent: string
) => {
  const subjectName = (
    await db("subjects").first("name").where("id", baseChanges.id_subject)
  )["name"];
  const dateString = baseChanges.date?.toLocaleString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  });
  const studentInfo = await db("users")
    .first("email", "name")
    .where("id", baseChanges.id_subject);
  if (baseChanges.status === EStatus.ACCEPTED) {
    /*
    sendEmail(
      studentInfo["email"],
      "¡Tu petición deasesoría fue aceptada!",
      confirmedAppointmentEmailForAdvisor()
    );*/
    createNotification(
      "Asesoría aceptada",
      "Tienes una Asesoría Aceptada",
      idStudent,
      ENotificationType.APPOINTMENT_ACCEPTED
    );
  } else if (baseChanges.status === EStatus.CANCELED) {
    /*
    sendEmail(
      studentInfo["email"],
      "¡Tu petición deasesoría fue aceptada!",
      appointmentCancelledEmail()
    );*/
    createNotification(
      "Asesoría rechazada",
      "Tu solicitud ha sido rechazada",
      idStudent,
      ENotificationType.APPOINTMENT_REJECTED
    );
  }
};

const notificationForUsers = async (
  baseChanges: IBaseChanges,
  detailsChanges: IIdsAppointmentDataMod
) => {
  for (const key in detailsChanges) {
    if (key === "id_advisor" && detailsChanges.id_advisor !== undefined) {
      createNotification(
        "Nueva Asesoría",
        "Has sido asignado/a a una nueva asesoría",
        detailsChanges.id_advisor,
        ENotificationType.APPOINTMENT_ACCEPTED
      );
      const advisorInfo = (
        await db("users")
          .first("email", "name")
          .where("id", detailsChanges.id_advisor)
      )["email"];
      const subjectName = (
        await db("subjects").first("name").where("id", baseChanges.id_subject)
      )["name"];

      // Send email notification to the selected advisor
      sendEmail(
        advisorInfo["email"],
        "Se te asignó una asesoría",
        confirmedAppointmentEmailForAdvisor(
          advisorInfo["name"],
          subjectName,
          baseChanges.date
            ? baseChanges.date.toLocaleString("es-MX", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Mexico_City",
              })
            : undefined,
          baseChanges.location ? baseChanges.location : undefined
        )
      );
    } else if (key === "id_admin" && detailsChanges.id_admin !== undefined) {
      createNotification(
        "Nueva solicitud de asesoría",
        "Has sido asignado/a a una nueva solicitud de asesoría.",
        detailsChanges.id_admin,
        ENotificationType.APPOINTMENT_ACCEPTED
      );
    }
  }
};

export const updateCandidate = async (req: Request, res: Response) => {
  const { idAppointment, idAdvisor, newState }: IUpdateaCandidate = req.body;

  try {
    if (newState == ECandidateStatus.REJECTED) {
      await db("appointment-advisorCandidates")
        .where({
          id_appointment: idAppointment,
          id_advisor: idAdvisor,
        })
        .delete();
      res.sendStatus(200);
    }

    await db("appointment-advisorCandidates")
      .where({
        id_appointment: idAppointment,
        id_advisor: idAdvisor,
      })
      .update("status", newState);
  } catch (error) {
    console.log(error);
    res.send(error);
  }

  res.sendStatus(200);
};

export const updateController = async (req: Request, res: Response) => {
  const { id, idStudent, baseChanges, detailChanges }: IUpdateaAppointment =
    req.body;

  //Update base Info
  try {
    await db("appointments").where("id", id).update(baseChanges);
  } catch (error) {
    res.send(error);
    console.error(error);
    return;
  }

  //Update details
  try {
    await db("appointments-user")
      .where("id_appointment", id)
      .update(detailChanges);
  } catch (error) {
    res.send(error);
    return;
  }

  try {
    await notificationForStudent(baseChanges, idStudent);
    await notificationForUsers(baseChanges, detailChanges);
  } catch (error) {
    res.send(error);
    return;
  }

  res.sendStatus(200);
};
