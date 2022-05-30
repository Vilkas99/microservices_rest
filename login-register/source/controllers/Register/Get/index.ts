import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

const UserModel = require("../../../models/User");

export const getUserData = async (req: Request, res: Response) => {
  const { id } = req.query;

  console.log("Recibiendo ID: ", id);

  try {
    let userType: any;
    userType = await UserModel.query().select("type").where("id", id);
    let userData: any;
    if (userType[0].type === "advisor") {
      userData = await UserModel.query()
        .findById(id)
        .withGraphFetched("career")
        .withGraphFetched("schedules");
    } else if (userType[0].type === "student") {
      userData = await UserModel.query()
        .findById(id)
        .withGraphFetched("career");
    } else {
      userData = await UserModel.query().findById(id);
    }
    res.json({
      status: "OK",
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const getAllUsersTypeData = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    let allUsersData: any;
    if (type === "advisor") {
      allUsersData = await UserModel.query()
        .where("type", type)
        .withGraphFetched("career")
        .withGraphFetched("schedules");
    } else if (type === "student") {
      allUsersData = await UserModel.query()
        .where("type", type)
        .withGraphFetched("career");
    } else {
      allUsersData = await UserModel.query().where("type", type);
    }
    res.json({
      status: "OK",
      userType: type,
      users: allUsersData,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
