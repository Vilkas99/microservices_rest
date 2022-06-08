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
  } = req.body;
  try {
    let newUserId = uuid();
    let alreadyExists = await UserModel.query()
      .select("email")
      .where("email", email);

    if (alreadyExists.length === 0) {
      await UserModel.query().insert({
        id: newUserId,
        name: name,
        email: email,
        password: password,
        status: status,
        type: type,
      });

      //Insert user data in careers table if type is advisor or student
      if (EType.root !== type) {
        const entryCareerUserId = uuid();
        await UserCareerModel.query().insert({
          id: entryCareerUserId,
          id_user: newUserId,
          id_career: career,
          semester: semester,
        });
        if (careerDD !== undefined) {
          const entrySecondCareerUserId = uuid();
          await UserCareerModel.query().insert({
            id: entrySecondCareerUserId,
            id_user: newUserId,
            id_career: careerDD,
            semester: semesterDD,
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
    console.log("ERROR AL CREAR USUARIO: ", error);
    res.send(error);
  }
};
