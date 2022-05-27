import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

const UserModel = require("../../../models/User");
const UserCareerModel = require("../../../models/UserCareer");
const SchedulesModel = require("../../../models/Schedules");

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    let alreadyExists = await UserModel.query().select("type").where("id", id);
    if (alreadyExists.length !== 0) {
      const deleteCareerQuery = await UserCareerModel.query()
        .delete()
        .where("id_user", id);
      if (alreadyExists[0].type === "advisor") {
        const deleteSchedulesQuery = await SchedulesModel.query()
          .delete()
          .where("advisor", id);
      }
      const deleteQuery = await UserModel.query().deleteById(id);
      res.json({
        status: "OK",
        msg: "User deleted successfully",
      });
    } else {
      res.json({
        status: "ERROR",
        msg: "User does not exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
