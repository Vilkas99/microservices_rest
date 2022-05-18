import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../../../db/db";

export const createController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idPetitioner, date, idSubject, problemDescription, image } =
    req.body!;

  enum EStatusAppointment {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
  }

  enum ENotificationType {
    "APPOINTMENT_ACCEPTED" = "APPOINTMENT_ACCEPTED",
    "APPOINTMENT_REJECTED" = "APPOINTMENT_REJECTED",
    "NEW_REQUEST" = "NEW_REQUEST",
    "MESSAGE" = "MESSAGE",
  }

  let newAppointmentId = uuidv4();
  try {
    // TODO: IMPORTANTE Sanitizar las entradas, especialemente la de problem_description
    let errorInAppointmentsUser;
    await db("appointments").insert({
      id: newAppointmentId,
      date: new Date(Date.parse(date)),
      status: EStatusAppointment.PENDING,
      location: "",
      id_subject: idSubject,
      problem_description: problemDescription,
      photo_url: image,
    });

    try {
      await db("appointments-user").insert({
        id: uuidv4(),
        id_appointment: newAppointmentId,
        id_student: idPetitioner,
        id_advisor: null,
        id_admin: "b4753ce1-0332-4a25-80bb-f6b5962b492f",
      });

      await axios
        .post("http://localhost:6090/notification/", {
          title: "Solicitud de Asesoría",
          description: "Una nueva asesoría se ha solicitado",
          idUser: "b4753ce1-0332-4a25-80bb-f6b5962b492f", //TODO: Reemplazar con una variable de entorno (O mejor aun, hacer una consulta a la tabla de users, y seleccionar un admin al azar)
          type: ENotificationType.NEW_REQUEST,
        })
        .then((res) => console.log("Notification Created"))
        .catch((er) => console.error(er));
    } catch (error) {
      errorInAppointmentsUser = error;
      console.error(error);
    }
    if (errorInAppointmentsUser) {
      throw errorInAppointmentsUser;
    }
    res.status(200).json({ newAppointmentId: newAppointmentId });
  } catch (error) {
    res.status(500);
    res.send(error);
    console.error(error);
  }
};
