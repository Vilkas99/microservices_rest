import { Request, Response, NextFunction } from "express";
import { uuid } from "uuidv4";
import "objection-password";
import db from "../../../db/db";
const UserModel = require("../../../models/User");
const UserCareerModel = require("../../../models/UserCareer");
const SchedulesModel = require("../../../models/Schedules");
const UserScheduleModel = require("../../../models/UserSchedule");

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
    let alreadyExists = await UserModel.query()
      .select("email")
      .where("email", email);
    console.log(alreadyExists);
    if (alreadyExists.length === 0) {
      await UserModel.query().insert({
        id: newUserId,
        name: name,
        email: email,
        password: password,
        status: status,
        type: type,
        created_at: new Date(),
        updated_at: new Date(),
      });

      //Insert user data in careers table if type is advisor or student
      if (EType.student === type || EType.advisor === type) {
        await UserCareerModel.query().insert({
          id: uuid(),
          id_user: newUserId,
          id_career: career,
          semester: semester,
          created_at: new Date(),
          updated_at: new Date(),
        });
        if (careerDD != undefined) {
          await UserCareerModel.query().insert({
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
          await SchedulesModel.query().insert({
            id: newScheduleId,
            start: schedules[i].start,
            finish: schedules[i].finish,
            period: schedules[i].period,
          });
          await UserScheduleModel.query().insert({
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
    } else {
      res.json({
        status: "Bad request",
        msg: "Email already exists",
      });
    }
  } catch (error) {
    console.log("ERROR AL CREAR USUARIO");
    res.send(error);
  }
};
