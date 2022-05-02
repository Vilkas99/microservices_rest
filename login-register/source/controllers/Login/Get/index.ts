import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

export const getUserLogin = async (req: Request, res: Response) => {
  const { email, password } = req.query;

  try {
    let curUser: any;
    curUser = await db("users").where({
      email: email as string,
      password: password as string,
    });

    console.log(curUser);
    if (curUser.length == 0) {
      res.sendStatus(200);
      console.log("Correo y/o contraseña incorrectos");
    } else {
      console.log("Inicio de sesión exitoso");
      const curUserId = curUser[0].id;
      res.send(curUserId);
    }
  } catch (error) {
    res.send(error);
  }
};
