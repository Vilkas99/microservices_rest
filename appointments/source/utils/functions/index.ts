import axios from "axios";
import { Request, Response } from "express";
import { ENotificationType } from "../enums";
import db from "../../db/db";

const {
  ValidationError,
  NotFoundError,
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} = require("objection");

export function errorHandler(err: any, res: Response) {
  if (err instanceof ValidationError) {
    switch (err.type) {
      case "ModelValidation":
        res.status(400).send({
          message: err.message,
          type: err.type,
          data: err.data,
        });
        break;
      case "RelationExpression":
        res.status(400).send({
          message: err.message,
          type: "RelationExpression",
          data: {},
        });
        break;
      case "UnallowedRelation":
        res.status(400).send({
          message: err.message,
          type: err.type,
          data: {},
        });
        break;
      case "InvalidGraph":
        res.status(400).send({
          message: err.message,
          type: err.type,
          data: {},
        });
        break;
      default:
        res.status(400).send({
          message: err.message,
          type: "UnknownValidationError",
          data: {},
        });
        break;
    }
  } else if (err instanceof NotFoundError) {
    res.status(404).send({
      message: err.message,
      type: "NotFound",
      data: {},
    });
  } else if (err instanceof UniqueViolationError) {
    res.status(409).send({
      message: err.message,
      type: "UniqueViolation",
      data: {
        columns: err.columns,
        table: err.table,
        constraint: err.constraint,
      },
    });
  } else if (err instanceof NotNullViolationError) {
    res.status(400).send({
      message: err.message,
      type: "NotNullViolation",
      data: {
        column: err.column,
        table: err.table,
      },
    });
  } else if (err instanceof ForeignKeyViolationError) {
    res.status(409).send({
      message: err.message,
      type: "ForeignKeyViolation",
      data: {
        table: err.table,
        constraint: err.constraint,
      },
    });
  } else if (err instanceof CheckViolationError) {
    res.status(400).send({
      message: err.message,
      type: "CheckViolation",
      data: {
        table: err.table,
        constraint: err.constraint,
      },
    });
  } else if (err instanceof DataError) {
    res.status(400).send({
      message: err.message,
      type: "InvalidData",
      data: {},
    });
  } else if (err instanceof DBError) {
    res.status(500).send({
      message: err.message,
      type: "UnknownDatabaseError",
      data: {},
    });
  } else {
    res.status(500).send({
      message: err.message,
      type: "UnknownError",
      data: {},
    });
  }
}

export const createNotification = async (
  title: string,
  description: string,
  receiverID: string,
  type: ENotificationType
) => {
  await axios
    .post("http://localhost:6090/notification/", {
      //TODO: Reemplazar por una variable env
      title,
      description,
      idUser: receiverID, //TODO: Reemplazar con una variable de entorno (O mejor aun, hacer una consulta a la tabla de users, y seleccionar un admin al azar)
      type,
    })
    .then((res) => console.log("Notification Created"))
    .catch((er) => console.error(er));
};

//////////////////////////GENERALES/////////////////////////

export const paramNotPresent = (
  param: string,
  res: Response,
  paramTitle: string
) => {
  if (param === "" || param === null || param === undefined) {
    res.status(400).send(`${paramTitle} is not provided by the client.`);
    return true;
  }
  return false;
};

export const isString = (x: any) => {
  return Object.prototype.toString.call(x) === "[object String]";
};

export const isNumber = (n: any) => {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
};

export const isBoolean = (n: any) => {
  return n === true || n === false || toString.call(n) === "[object Boolean]";
};

export const isUUID = (uuid: any) => {
  return uuid.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
};

///////////////////////////////////////////////////////

//////////////////////////USERS/////////////////////////

export const isMail = (n: any) => {
  if (n.match("^[A||a||l||L][0-9]{8}@tec.mx$") && isString(n)) {
    return true;
  } else {
    return false;
  }
};

export const isPassword = (n: any) => {
  return isString(n) && n.length >= 8;
};

export const isUser = async (uuid: any) => {
  try {
    const idUserObject: any = await db
      .select("id")
      .from("users")
      .where("id", uuid);

    if (idUserObject === undefined || idUserObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const isUserAdmin = async (uuid: any) => {
  try {
    const idAdminObject: any = await db
      .select("id")
      .from("users")
      .where("id", uuid)
      .andWhere("type", "admin");

    if (idAdminObject === undefined || idAdminObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const isUserStudent = async (uuid: any) => {
  try {
    const idStudentObject: any = await db
      .select("id")
      .from("users")
      .where("id", uuid)
      .andWhere("type", "student");

    if (idStudentObject === undefined || idStudentObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const isUserAdvisor = async (uuid: any) => {
  try {
    const idAdvisorObject: any = await db
      .select("id")
      .from("users")
      .where("id", uuid)
      .andWhere("type", "advisor");

    if (idAdvisorObject === undefined || idAdvisorObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const isUserRoot = async (uuid: any) => {
  try {
    const idRootObject: any = await db
      .select("id")
      .from("users")
      .where("id", uuid)
      .andWhere("type", "root");

    if (idRootObject === undefined || idRootObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

///////////////////////////////////////////////////////

//////////////////////////APPONTMENTS/////////////////////////

export const isAppointment = async (uuid: any) => {
  try {
    const idAppointmentObject: any = await db
      .select("id")
      .from("appointments")
      .where("id", uuid);

    if (idAppointmentObject === undefined || idAppointmentObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const isFirebasePhoto = (n: any) => {
  if (n.match("^https://firebasestorage.googleapis.com/.*$") && isString(n)) {
    return true;
  } else {
    return false;
  }
};

///////////////////////////////////////////////////////

//////////////////////////CAREERS/////////////////////////
export const isCareer = async (uuid: any) => {
  try {
    const idCareerObject: any = await db
      .select("id")
      .from("careers")
      .where("id", uuid);

    if (idCareerObject === undefined || idCareerObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

///////////////////////////////////////////////////////

//////////////////////////EMAILVERIFICATIONS/////////////////////////
export const isEmailVerification = async (uuid: any) => {
  try {
    const idEmailVerificationObject: any = await db
      .select("id")
      .from("emailVerifications")
      .where("id", uuid);

    if (
      idEmailVerificationObject === undefined ||
      idEmailVerificationObject.length === 0
    ) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

///////////////////////////////////////////////////////

//////////////////////////NOTIFICATIONS/////////////////////////
export const isNotification = async (uuid: any) => {
  try {
    const idNotificationObject: any = await db
      .select("id")
      .from("notifications")
      .where("id", uuid);

    if (
      idNotificationObject === undefined ||
      idNotificationObject.length === 0
    ) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

///////////////////////////////////////////////////////

//////////////////////////POLLREPORTS/////////////////////////
export const isPollReport = async (uuid: any) => {
  try {
    const idPollReportObject: any = await db
      .select("id")
      .from("poll-reports")
      .where("id", uuid);

    if (idPollReportObject === undefined || idPollReportObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

///////////////////////////////////////////////////////

//////////////////////////QUESTIONS/////////////////////////
export const isQuestion = async (uuid: any) => {
  try {
    const idQuestionObject: any = await db
      .select("id")
      .from("questions")
      .where("id", uuid);

    if (idQuestionObject === undefined || idQuestionObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

///////////////////////////////////////////////////////

//////////////////////////SCHEDULES/////////////////////////
export const isSchedule = async (uuid: any) => {
  try {
    const idScheduleObject: any = await db
      .select("id")
      .from("schedules")
      .where("id", uuid);

    if (idScheduleObject === undefined || idScheduleObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

///////////////////////////////////////////////////////

//////////////////////////SUBJECTS/////////////////////////
export const isSubject = async (uuid: any) => {
  try {
    const idSubjectObject: any = await db
      .select("id")
      .from("subjects")
      .where("id", uuid);

    if (idSubjectObject === undefined || idSubjectObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

///////////////////////////////////////////////////////
