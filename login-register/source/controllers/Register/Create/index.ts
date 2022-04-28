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
  semestreDD?: Number;
  status: EStatus;
  type: EType;
}
interface INewUserSchedule {
  start: Date;
  finish: Date;
  period: Number;
}
export const createUser = async (req: Request, res: Response) => {
  console.log("CREANDO NUEVO USUARIO...");
  //Create user
  const { name, email, password, semester, status, type }: INewUserData =
    req.body;
  try {
    let newUserId = uuid();
    await db("users").insert({
      id: newUserId,
      name: name,
      email: email,
      password: password,
      semester: semester,
      status: status,
      type: type,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.sendStatus(200);
    //TODO: Insert user data in careers table if type is advisor or student
    if (EType.student === type || EType.advisor === type) {
      console.log("INSERTANDO CARRERA DEL USUARIO...");
      await db("users-career").insert({
        id: uuid(),
        id_user: newUserId,
        id_career: "TODO", //careerId
      });
      //TODO (again lol): Insert double degree career if is not undefined.
      /*
        if (careerDD != undefinded){
          await db("users-career").insert({
            id: uuid(),
            id_user: newUserId,
            id_career: "TODO", //careerIdDD
          });
        }
      */
    }
    //Create user schedules if type is advisor
    if (EType.advisor === type) {
      console.log("CREANDO HORARIOS DEL USUARIO...");
      for (let i = 0; i < 3; i++) {
        const { start, finish, period }: INewUserSchedule = req.body;
        let newScheduleId = uuid();
        await db("schedules").insert({
          id: newScheduleId,
          start: start,
          finish: finish,
          period: period,
        });
        await db("user-schedules").insert({
          id: uuid(),
          id_user: newUserId,
          id_schedule: newScheduleId,
        });
      }
    }
  } catch (error) {
    console.log("ERROR AL CREAR USUARIO");
    res.send(error);
  }
};
