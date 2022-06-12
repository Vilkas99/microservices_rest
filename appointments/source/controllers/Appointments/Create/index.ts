import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../../../db/db";
import { ENotificationType } from "../../../utils/enums";
import { newAppointmentEmailForAdmin } from "../../../email/Templates/New Appointment - Admin/template";
import { sendEmail } from "../../../email";

export const createController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idPetitioner, date, idSubject, problemDescription, image } = req.body;

  enum EStatusAppointment {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
  }

  let newAppointmentId = uuidv4();
  try {
    // TODO: IMPORTANTE Sanitizar las entradas, especialemente la de problem_description
    let errorInAppointmentsUser;
    let errorMessage;
    const dateObject = new Date(Date.parse(date));
    if (dateObject.getDay() == 0 || dateObject.getDay() == 6) {
      res.status(400);
      throw "Cannot schedule an appointment on weekends";
    }
    const dateString = dateObject.toLocaleString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Mexico_City",
    });
    await db("appointments").insert({
      id: newAppointmentId,
      date: dateObject,
      status: EStatusAppointment.PENDING,
      location: "",
      id_subject: idSubject,
      problem_description: problemDescription,
      photo_url: image,
    });

    try {
      const idAdmin = await db("users")
        .first("id", "email", "name")
        .where("type", "admin");

      await db("appointments-user").insert({
        id: uuidv4(),
        id_appointment: newAppointmentId,
        id_student: idPetitioner,
        id_advisor: null,
        id_admin: idAdmin["id"],
      });

      const candidates = await db("appointment-advisorCandidates")
        .select("id_appointment")
        .where("id_appointment", newAppointmentId);
      const subject = await db("subjects").first("name").where("id", idSubject);

      await axios
        .post(
          "https://dashboard.yellowplant-d0967952.westus.azurecontainerapps.io:6090/notification/",
          {
            //TODO: Reemplazar por una variable env
            title: "Solicitud de Asesoría",
            description: "Una nueva asesoría se ha solicitado",
            idUser: idAdmin["id"],
            type: ENotificationType.NEW_REQUEST,
          }
        )
        .then((res) => console.log("Notification Created"))
        .catch((er) => console.error(er));
      res.status(200).json({ newAppointmentId: newAppointmentId });

      //Envío de emails a quienes corresponde

      // Para el admin
      sendEmail(
        "A01733922@tec.mx",
        "Hay una nueva solicitud de asesoría",
        newAppointmentEmailForAdmin(
          idAdmin["name"],
          subject["name"],
          dateString[0].toUpperCase() + dateString.substring(1),
          candidates.length,
          "http://www.paepue.com/dashboard"
        )
      );

      // Para los candidatos
      //const advisors = await db("")
    } catch (error) {
      errorInAppointmentsUser = error;
      console.error(error);
    }
    if (errorInAppointmentsUser) {
      res.status(500);
      throw errorInAppointmentsUser;
    }
  } catch (error) {
    res.send(error);
    console.error(error);
  }
};
