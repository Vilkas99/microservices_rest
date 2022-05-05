import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

export const getUserData = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    //get user basic data
    const userQuery = await db("users").where({ id: id });
    let userData = userQuery[0];
    //get user career data
    const userCareerQuery = await db("users-career")
      .where({ id_user: id })
      .select("id_career", "semester");
    //get user schedule data if their user type is advisor
    if (userData.type === "advisor") {
      const userScheduleQuery = await db("users-schedule")
        .where({ id_user: id })
        .select("id_schedule");
      res.json({
        status: "OK",
        user: userData,
        userCareer: userCareerQuery,
        userSChedules: userScheduleQuery,
      });
    } else {
      res.json({
        status: "OK",
        user: userData,
        userCareer: userCareerQuery,
      });
    }
  } catch (error) {
    res.send(error);
  }
};
