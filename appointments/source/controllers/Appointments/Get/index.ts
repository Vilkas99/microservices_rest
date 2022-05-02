import { Request, Response } from "express";
import db from "../../../db/db";

enum EStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}
interface IAppointmentData extends IAppointmentDataMod {
  id: string;
  created_at: Date;
  updated_at: Date;
}

interface IAppointmentDataMod {
  date?: string | Date | Date;
  id_subject?: string;
  status?: EStatus;
  location?: string;
  problem_description?: string;
  photo_url?: string;
}

interface IIdsAppointmentData extends IIdsAppointmentDataMod {
  id: string;
  id_appointment: string;
}

interface IIdsAppointmentDataMod {
  id_student?: string;
  id_advisor?: string;
  id_admin?: string;
}

interface IGetAppointment {
  id: string;
  id_type?: "admin" | "student" | "advisor";
}

// ---------------------- PRIMERA -------------------------------------------
// Endpoint que obtiene la asesoría más reciente de un admin

export const getAdmin = async (req: Request, res: Response) => {
  console.log("GET :D ADMIN FUNCIONA");
  const { id, id_type } = req.query;

  let columna: string;
  if (id_type == "admin") {
    columna = "PENDING";
  } else if (id_type == "advisor") {
    columna = "ACCEPTED";
  } else {
    columna = "ACCEPTED";
  }

  try {
    const adminFirstAppointment: any = await db
      .first(
        "appointments.id",
        "appointments.date",
        "appointments.id_subject",
        "appointments.status",
        "appointments.location",
        "appointments.problem_description",
        "appointments.photo_url",
        "appointments.created_at",
        "appointments.updated_at"
      )
      .from("appointments")
      .join(
        "appointments-user",
        "appointments.id",
        "=",
        "appointments-user.id_appointment"
      )
      .where({
        "appointments-user.id_student": id as string,
        "appointments.status": columna,
      })
      .orderBy("appointments.created_at", "desc");
    res.json(adminFirstAppointment);
    console.log(adminFirstAppointment);
    res.statusCode = 200;
  } catch (error) {
    res.send(error);
  }
};

// ---------------------- SEGUNDA -------------------------------------------
// Endpoint que obtiene la asesoría activa más reciente de un admin

export const getStatus = async (req: Request, res: Response) => {
  console.log("GET :D ESTATUS FUNCIONA");
  const id = req.query["id"];

  try {
    const adminFirstAppointment: any = await db
      .first(
        "appointments.id",
        "appointments.date",
        "appointments.id_subject",
        "appointments.status",
        "appointments.location",
        "appointments.problem_description",
        "appointments.photo_url",
        "appointments.created_at",
        "appointments.updated_at"
      )
      .from("appointments")
      .join(
        "appointments-user",
        "appointments.id",
        "=",
        "appointments-user.id_appointment"
      )
      .where({
        "appointments-user.id_student": id as string,
        "appointments.status": "PENDING",
      })
      .orderBy("appointments.created_at", "desc");
    res.json(adminFirstAppointment);
    res.statusCode = 200;
  } catch (error) {
    res.send(error);
  }
};

// ---------------------- TERCERA -------------------------------------------
// Todas las asesorías dependiendo del tipo de usuario

export const getAll = async (req: Request, res: Response) => {
  const { id, id_type } = req.query;
  let columna: string;
  if (id_type == "admin") {
    columna = "appointments-user.id_admin";
  } else if (id_type == "advisor") {
    columna = "appointments-user.id_advisor";
  } else {
    columna = "appointments-user.id_student";
  }

  try {
    const adminFirstAppointment: any = await db
      .select("*")
      .from("appointments")
      .join(
        "appointments-user",
        "appointments.id",
        "=",
        "appointments-user.id_appointment"
      )
      .where(columna, id as string);

    res.json(adminFirstAppointment);
    res.statusCode = 200;
  } catch (error) {
    res.send(error);
  }
};
