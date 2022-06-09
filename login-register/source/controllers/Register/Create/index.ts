import { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";
import { sendEmail } from "../../../email/index";
import { verificationEmailForUser } from "../../../email/templates/confirmationEmal/template";
import { generate as genereteToken } from "rand-token";
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

enum EVerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
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
    let newUserId = v4();
    let alreadyExists = await UserModel.query()
      .select("email")
      .where("email", email);

    if (alreadyExists.length === 0) {
      await UserModel.query().insert({
        id: newUserId,
        name: name,
        email: email,
        password: password,
        status: "INACTIVE",
        type: type,
      });

      const confirmationToken = genereteToken(32);

      await db("emailVerifications").insert({
        id: v4(),
        id_user: newUserId,
        token: confirmationToken,
        status: EVerificationStatus.PENDING,
      });

      // Send verification email
      sendEmail(
        email,
        "Confirma tu cuenta de PAE",
        verificationEmailForUser(
          name,
          `http://localhost:3000/verififyEmail/${confirmationToken}`,
          `http://localhost:3000/verififyEmail/${confirmationToken}/cancel`
        )
      );

      //Insert user data in careers table if type is advisor or student
      if (EType.root !== type) {
        const entryCareerUserId = v4();
        await UserCareerModel.query().insert({
          id: entryCareerUserId,
          id_user: newUserId,
          id_career: career,
          semester: semester,
        });
        if (careerDD !== undefined) {
          const entrySecondCareerUserId = v4();
          await UserCareerModel.query().insert({
            id: entrySecondCareerUserId,
            id_user: newUserId,
            id_career: careerDD,
            semester: semesterDD,
          });
        }
      }
      res.status(200).json({
        status: "OK",
        userId: newUserId,
      });
    } else {
      res.status(400).json({
        reason: 1,
        msg: "Email already exists",
      });
    }
  } catch (error) {
    console.log("ERROR AL CREAR USUARIO: ", error);
    res.status(500).send(error);
  }
};
