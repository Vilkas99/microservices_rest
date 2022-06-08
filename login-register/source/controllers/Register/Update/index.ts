import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

const UserModel = require("../../../models/User");
const UserCareerModel = require("../../..//models/UserCareer");
const CareerModel = require("../../../models/Career");
enum EStatus {
  DELETED = "DELETED",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
interface IUserDataToUpdate {
  name?: string;
  email?: string;
  password?: string;
  career?: string;
  status?: EStatus;
  configuration?: JSON;
  updated_at: Date;
}
interface ICareerDataToUpdate {
  id_career?: string;
  semester?: string;
  updated_at: Date;
}
interface IUserData {
  id: string;
  career: string;
  dataToUpdate: IUserDataToUpdate;
  careerDataToUpdate: ICareerDataToUpdate;
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id, dataToUpdate, careerDataToUpdate }: IUserData = req.body;
    await UserModel.query().findById(id).patch(dataToUpdate);
    await UserCareerModel.query()
      .patch(careerDataToUpdate)
      .where("id_user", id);
    res.json({
      status: "OK",
      msg: "User data has been updated",
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
