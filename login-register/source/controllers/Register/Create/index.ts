import { Request, Response, NextFunction } from "express";
import { uuid } from "uuidv4";

import db from "../../../db/db";
//TODO: Considerar las inserciones a las tablas de usuario como user-schedule o user-career en este microservicio
enum EType {
  student = "student",
  advisor = "advisor",
  admin = "admin",
  root = "root",
}
enum EStatus {
  DELETED = "DELETED",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
interface INewUserData {
  name: string;
  email: string;
  password: string;
  career: string;
  semester: Number;
  careerDD?: string;
  semesterDD?: Number;
  status: EStatus;
  type: EType;
  schedules?: Array<INewUserSchedule>;
}
interface INewUserSchedule {
  start: Date;
  finish: Date;
  period: Number;
}
export const createUser = async (req: Request, res: Response) => {
  //Create user
  const {
    name,
    email,
    password,
    career,
    semester,
    careerDD,
    semesterDD,
    status,
    type,
    schedules,
  }: INewUserData = req.body;
  try {
    let newUserId = uuid();
    await db("users").insert({
      id: newUserId,
      name: name,
      email: email,
      password: password,
      status: status,
      type: type,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.sendStatus(200);
    //Insert user data in careers table if type is advisor or student
    if (EType.student === type || EType.advisor === type) {
      await db("users-career").insert({
        id: uuid(),
        id_user: newUserId,
        id_career: career,
        semester: semester,
        created_at: new Date(),
        updated_at: new Date(),
      });
      if (careerDD != undefined) {
        await db("users-career").insert({
          id: uuid(),
          id_user: newUserId,
          id_career: careerDD,
          semester: semesterDD,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }
    //Create user schedules if type is advisor
    if (EType.advisor === type && schedules != undefined) {
      for (let i = 0; i < schedules.length; i++) {
        let newScheduleId = uuid();
        await db("schedules").insert({
          id: newScheduleId,
          start: schedules[i].start,
          finish: schedules[i].finish,
          period: schedules[i].period,
        });
        await db("users-schedule").insert({
          id: uuid(),
          id_user: newUserId,
          id_schedule: newScheduleId,
        });
      }
    }
    res.json({
      status: "OK",
      userId: newUserId,
    });
  } catch (error) {
    console.log("ERROR AL CREAR USUARIO");
    res.send(error);
  }
};
