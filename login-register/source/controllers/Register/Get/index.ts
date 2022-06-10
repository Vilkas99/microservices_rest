import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

const UserModel = require("../../../models/User");
const UserCareerModel = require("../../../models/UserCareer");

export const getUserData = async (req: Request, res: Response) => {
  const { id } = req.query;

  console.log("Recibiendo ID: ", id);

  try {
    if (id !== undefined) {
      let userType: any;
      userType = await UserModel.query().select("type").where("id", id);
      let userData: any;
      if (userType.length > 0) {
        if (userType[0].type === "advisor") {
          userData = await UserModel.query()
            .select("id", "status", "name", "email", "type", "configuration")
            .findById(id)
            .withGraphFetched("userSemesters(orderByCreated)")
            .modifiers({
              orderByCreated(builder: any) {
                builder.orderBy("created_at");
              },
            })
            .withGraphFetched("career(orderByDD)")
            .modifiers({
              orderByDD(builder: any) {
                builder.orderBy("doubleDegree");
              },
            })
            .withGraphFetched("schedules");
        } else if (userType[0].type !== "root") {
          userData = await UserModel.query()
            .select("id", "status", "name", "email", "type", "configuration")
            .findById(id)
            .withGraphFetched("userSemesters(orderByCreated)")
            .modifiers({
              orderByCreated(builder: any) {
                builder.orderBy("created_at");
              },
            })
            .withGraphFetched("career(orderByDD)")
            .modifiers({
              orderByDD(builder: any) {
                builder.orderBy("doubleDegree");
              },
            });
        } else {
          userData = await UserModel.query()
            .select("id", "status", "name", "email", "type", "configuration")
            .findById(id);
        }
        res.json({
          status: "OK",
          user: userData,
        });
      } else {
        res.json({
          status: "Bad request",
          msg: "Given user does not exist",
        });
      }
    } else {
      res.json({
        status: "Bad request",
        msg: "User id not given",
      });
    }
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
        .withGraphFetched("userSemesters")
        .withGraphFetched("schedules");
    } else if (type !== "root") {
      allUsersData = await UserModel.query()
        .where("type", type)
        .withGraphFetched("career")
        .withGraphFetched("userSemesters");
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
