import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

const UserModel = require("../../../models/User");
enum EStatus {
  DELETED = "DELETED",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
interface IUserDataToUpdate {
  name?: string;
  email?: string;
  password?: string;
  status?: EStatus;
  configuration?: JSON;
  updated_at: Date;
}
interface IUserData {
  id: string;
  dataToUpdate: IUserDataToUpdate;
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id, dataToUpdate }: IUserData = req.body;
    const userUpdate = await UserModel.query().findById(id).patch(dataToUpdate);
    res.json({
      status: "OK",
      msg: "User data has been updated",
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
