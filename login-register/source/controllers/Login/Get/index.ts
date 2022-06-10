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
      if (curUser.status === "ACTIVE") {
        const passwordValid = await curUser.verifyPassword(password);

        if (passwordValid) {
          console.log("Usuario actual: ", curUser.id);
          res.json({
            status: "OK",
            userId: curUser.id,
          });
        } else {
          res.status(400).json({
            status: "Bad request",
            reason: 0,
            msg: "Wrong password",
          });
        }
      } else {
        res.status(400).json({
          status: "Bad request",
          reason: 1,
          msg: "Given email is not active",
        });
      }
    }
  } catch (error) {
    res.send(error);
  }
};
