import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";
const UserModel = require("../../../models/User");
export const getUserLogin = async (req: Request, res: Response) => {
  const { email, password } = req.query;

  try {
    let curUser: any;
    curUser = await UserModel.query().first().where("email", email);
    if (curUser === undefined) {
      res.json({
        status: "Bad request",
        msg: "Email not found",
      });
    } else {
      const passwordValid = await curUser.verifyPassword(password);
      if (passwordValid) {
        const curUserId = curUser.id;
        res.json({
          status: "OK",
          userId: curUserId,
        });
      } else {
        res.json({
          status: "Bad request",
          msg: "Wrong password",
        });
      }
    }
  } catch (error) {
    res.send(error);
  }
};
