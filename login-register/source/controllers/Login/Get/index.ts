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
      // TODO: Encontrar una mejor forma de manejar el caso de no permitir al acesor entrar si no confirmó su correo
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
        const hasSchedules = await db("schedules")
          .count()
          .where("advisor", curUser.id);
        //console.log("horarios", hasSchedules[0].count);
        if (
          curUser.type != "advisor" ||
          (curUser.type == "advisor" && hasSchedules[0].count != "0")
        ) {
          res.status(400).json({
            status: "Bad request",
            reason: 1,
            msg: "Given email is not active",
          });
          return;
        }

        // Dar la info del asesor solo en el registro o si no tiene horarios para que los añada
        //por alguna razón, count en knex-postgres regresa string http://knexjs.org/guide/query-builder.html#count
        else {
          res.json({
            status: "OK",
            userId: curUser.id,
          });
        }
      }
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
