import { parseISO } from "date-fns";
import { Request, Response } from "express";
import db from "../../../db/db";

const AppointmentModel = require("../../../models/Appointment");
const AppointmentUserModel = require("../../../models/AppointmentUser");
const UserModel = require("../../../models/User");
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

    res.statusCode = 200;
  } catch (error) {
    res.send(error);
  }
};

// ---------------------- SEGUNDA -------------------------------------------
// Endpoint que obtiene la asesoría activa más reciente de un admin

export const getStatus = async (req: Request, res: Response) => {
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

interface IQueryGetAll {
  id: string;
  userType: EUserType;
  full?: boolean;
  limit?: number;
  orderBy?: "desc" | "asc" | "";
}

export const getAll = async (req: Request, res: Response) => {
  let { id, userType, full, limit, orderBy } =
    req.query as unknown as IQueryGetAll;

  if (full === undefined || full === null) {
    full = false;
  }

  if (orderBy !== "" || orderBy === undefined) {
    orderBy = "desc";
  }

  try {
    const column =
      userType === EUserType.admin
        ? "id_admin"
        : userType === EUserType.advisor
        ? "id_advisor"
        : "id_student";

    if (full) {
      let fullInfo;
      if (limit !== undefined) {
        fullInfo = await AppointmentUserModel.query()
          .where({
            [column]: id,
          })
          .orderBy("created_at", orderBy)
          .withGraphFetched("appointment")
          .withGraphFetched("student")
          .withGraphFetched("advisor")
          .withGraphFetched("admin")
          .withGraphFetched("subject")
          .limit(limit);
      } else {
        fullInfo = await AppointmentUserModel.query()
          .where({
            [column]: id,
          })
          .orderBy("created_at", orderBy)
          .withGraphFetched("appointment")
          .withGraphFetched("student")
          .withGraphFetched("advisor")
          .withGraphFetched("admin")
          .withGraphFetched("subject");
      }

      addFinalInfo(fullInfo)
        .then((value) => {
          res.json(value);
          res.statusCode = 200;
        })
        .catch((e) => console.error(e));
    } else {
      let info;
      if (limit !== undefined) {
        info = await AppointmentUserModel.query()
          .where({ [column]: id })
          .orderBy("created_at", orderBy)
          .withGraphFetched("subject")
          .withGraphFetched("appointment")
          .limit(limit);
      } else {
        info = await AppointmentUserModel.query()
          .where({ [column]: id })
          .orderBy("created_at", orderBy)
          .withGraphFetched("subject")
          .withGraphFetched("appointment");
      }

      res.json(info).status(200);
    }
  } catch (error) {
    console.error(error);
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

export const getPossibleDates = async (req: Request, res: Response) => {
  const getDatesOfNextWeeksDays = (dayOfWeek: number, howManyWeeks: number) => {
    let dates = [];

    const refDate = new Date();
    refDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < howManyWeeks; i++) {
      refDate.setDate(
        refDate.getDate() + 1 + ((dayOfWeek + 7 - refDate.getDay() - 1) % 7)
      );
      dates.push(new Date(refDate));
    }
    return dates;
  };

  const { idSubject } = req.query;
  if (idSubject === undefined) {
    res.status(400);
    throw "Query info was not provided";
  }

  db.raw(
    `SELECT DISTINCT day, start, finish
    FROM schedules
    WHERE advisor IN (
    SELECT id_user
    FROM "career-subject" JOIN "users-career" USING(id_career)
    WHERE id_subject = ?
    AND semester > (SELECT semester FROM subjects WHERE id = ?)
    AND get_user_weekly_credited_hours(id_user) < 5)
    `,
    [idSubject.toString(), idSubject.toString()]
  )
    .then((resp) => {
      // resp.rows tiene los horarios de quienes pueden darla, pero no se ha filtrado los que ya están ocupados

      let schedules: Date[] = [];
      const timestamp = new Date();
      for (const schedule of resp.rows) {
        const dayOfWeek = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].indexOf(
          schedule["day"].slice(0, 2)
        );

        const datesToCheck = getDatesOfNextWeeksDays(dayOfWeek, 1);

        // este paso es muy necesario porque, por el momento, no sabemos si el server va a estar en hora de cdmx
        const startMXDate = new Date(
          schedule["start"].toLocaleString("en-US", {
            timeZone: "America/Mexico_City",
          })
        );
        const finishMXDate = new Date(
          schedule["finish"].toLocaleString("en-US", {
            timeZone: "America/Mexico_City",
          })
        );

        let howManyHours = finishMXDate.getHours() - startMXDate.getHours();
        for (let i = 0; i < howManyHours; i++) {
          for (const dateToCheck of datesToCheck) {
            timestamp.setTime(schedule["start"].getTime() + i * 60 * 60 * 1000);
            timestamp.setMonth(dateToCheck.getMonth());
            timestamp.setDate(dateToCheck.getDate());
            schedules.push(new Date(timestamp));
          }
        }
      }

      let nonAvilableSchedules = new Set<number>();
      db.select("date")
        .from("appointments")
        .where("status", "ACCEPTED")
        .then((result) => {
          for (const entry of result) {
            nonAvilableSchedules.add(
              new Date(
                entry["date"].toLocaleString("en-US", {
                  timeZone: "America/Mexico_City",
                })
              ).getTime()
            );
          }
          // eliminar los horarios repetidos y en los que ya hay una asesoría aceptada
          schedules = schedules.filter(
            (date, i, self) =>
              self.findIndex((d) => d.getTime() === date.getTime()) === i &&
              !nonAvilableSchedules.has(date.getTime())
          );
          res.status(200).send("test");
        });
    })
    .catch((error) => {
      res.send(error);
    });
};
