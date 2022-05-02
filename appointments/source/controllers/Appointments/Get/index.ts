<<<<<<< HEAD
export const getController = () => {};
=======
>>>>>>> 27ca3d57425911fece01127dec78f9f2ac2a32b2
import { Request, Response } from "express";
import db from "../../../db/db";

enum EStatus {
<<<<<<< HEAD
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
=======
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
  CANCELED = "CANCELED",
  FINISHED = "FINISHED",
>>>>>>> 27ca3d57425911fece01127dec78f9f2ac2a32b2
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
  const id = req.query["id"];

  try {
    const adminFirstAppointment: any = await db
      .first("*")
      .from("appointments")
      .where("id", id as string)
      .orderBy("created_at", "desc");
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
      .first("*")
      .from("appointments")
      .join(
        "appointments-user",
        "appointments.id",
        "=",
        "appointments-user.id_appointment"
      )
<<<<<<< HEAD
      .where({ status: "PENDING", "appointments-user.id_admin": id })
=======
      .where({ status: "ACTIVE", "appointments-user.id_admin": id })
>>>>>>> 27ca3d57425911fece01127dec78f9f2ac2a32b2
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
  console.log("GET :D TODO FUNCIONA");
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
