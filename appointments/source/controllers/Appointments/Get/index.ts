import { Request, Response } from "express";
import db from "../../../db/db";

const AppointmentModel = require("../../../models/Appointment");
const AppointmentUserModel = require("../../../models/AppointmentUser");
const SubjectsModel = require("../../../models/Subjects");

enum EStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

const enum EUserType {
  advisor = "advisor",
  student = "student",
  admin = "admin",
  root = "root",
}

interface IAppointmentDataMod {
  date?: string | Date | Date;
  id_subject?: string;
  status?: EStatus;
  location?: string;
  problem_description?: string;
  photo_url?: string;
}

interface IIdsAppointmentDataMod {
  id_student?: string;
  id_advisor?: string;
  id_admin?: string;
}

// ---------------------- PRIMERA -------------------------------------------
// Endpoint que obtiene la asesoría más reciente de un admin

export const getAdmin = async (req: Request, res: Response) => {
  console.log("GET :D ADMIN FUNCIONA");
  const { id, id_type } = req.query;

  let columna: string;
  let value: string;
  if (id_type == "admin") {
    columna = "PENDING";
    value = "appointments-user.id_admin";
  } else if (id_type == "advisor") {
    columna = "ACCEPTED";
    value = "appointments-user.id_advisor";
  } else {
    columna = "ACCEPTED";
    value = "appointments-user.id_student";
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
      .where("appointments.status", columna)
      .where(value, id as string)
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

const getSubject = async (id: string) => {
  const mySubject = await SubjectsModel.query().findById(id).select("name");
  return mySubject;
};

const addFinalInfo = async (fullInfo: any) => {
  const finalInfo: any = [];
  for (const object of fullInfo) {
    const id = object.appointment.id_subject;
    let subject = await getSubject(id);
    //TODO: Add semester to student profile
    finalInfo.push({
      subject: subject,
      appointment: object.appointment,
      student: object.student[0],
      advisor: object.advisor[0],
      admin: object.admin[0],
    });
  }
  return finalInfo;
};

export const getAll = async (req: Request, res: Response) => {
  const { id, userType } = req.query;
  try {
    const column =
      userType === EUserType.admin
        ? "id_admin"
        : userType === EUserType.advisor
        ? "id_advisor"
        : "id_student";

    const fullInfo = await AppointmentUserModel.query()
      .where({
        [column]: id,
      })
      .withGraphFetched("appointment")
      .withGraphFetched("student")
      .withGraphFetched("advisor")
      .withGraphFetched("admin");

    addFinalInfo(fullInfo)
      .then((value) => {
        console.log(value);
        res.json(value);
        res.statusCode = 200;
      })
      .catch((e) => console.error(e));
  } catch (error) {
    res.send(error);
  }
};

// ---------------------- Objection -------------------------------------------
// Obtener los datos del appointment y del usuario
export const getObjection = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    let info: any;

    info = await AppointmentModel.query()
      .findById(id)
      .withGraphFetched("student")
      .withGraphFetched("advisor")
      .withGraphFetched("admin");

    res.json(info);
    res.statusCode = 200;
  } catch (error) {
    res.send(error);
  }
};
