import { eachHourOfInterval } from "date-fns";
import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";
import { ENotificationType } from "../../../utils/enums";
import { createNotification } from "../../../utils/functions";

enum EStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
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
  id_appointment: string;
  id_user: string;
  newState: EStatus;
}

const notificationForStudent = (
  baseChanges: IBaseChanges,
  idStudent: string
) => {
  if (baseChanges.status === EStatus.ACCEPTED) {
    createNotification(
      "Asesoría aceptada",
      "Tienes una Asesoría Aceptada",
      idStudent,
      ENotificationType.APPOINTMENT_ACCEPTED
    );
  } else if (baseChanges.status === EStatus.CANCELED) {
    createNotification(
      "Asesoría rechazada",
      "Tu solicitud ha sido rechazada",
      idStudent,
      ENotificationType.APPOINTMENT_REJECTED
    );
  }
};

const notificationForUsers = (detailsChanges: IIdsAppointmentDataMod) => {
  for (const key in detailsChanges) {
    if (key === "id_advisor" && detailsChanges.id_advisor !== undefined) {
      createNotification(
        "Nueva Asesoría",
        "Has sido asignado/a a una nueva asesoría",
        detailsChanges.id_advisor,
        ENotificationType.APPOINTMENT_ACCEPTED
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
  const { id_appointment, id_user, newState }: IUpdateaCandidate = req.body;

  try {
    await db("appointments-advisorCandidates")
      .where({
        id_appointment: id_appointment,
        id_advisor: id_user,
      })
      .update("status", "ACTIVE");
  } catch (error) {
    res.send(error);
    console.error(error);
    return;
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
    await notificationForUsers(detailChanges);
  } catch (error) {
    res.send(error);
    return;
  }

  res.sendStatus(200);
};
