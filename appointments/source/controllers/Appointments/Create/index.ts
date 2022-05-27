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
    } catch (error) {
      errorInAppointmentsUser = error;
      console.error(error);
    }
    if (errorInAppointmentsUser) {
      res.status(500);
      throw errorInAppointmentsUser;
    }
    res.status(200).json({ newAppointmentId: newAppointmentId });
  } catch (error) {
    res.send(error);
    console.error(error);
  }
};
