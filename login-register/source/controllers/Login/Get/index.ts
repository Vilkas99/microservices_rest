import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

interface IUserLoginData {
  email: string;
  password: string;
}

export const getUserLogin = async (req: Request, res: Response) => {
  console.log("VERIFICANDO CREDENCIALES");
  const { email, password }: IUserLoginData = req.body;

  try {
    let curUser: any;
    curUser = await db("users").where({ email: email, password: password });

    console.log(curUser);
    if (curUser.length == 0) {
      res.sendStatus(200);
      console.log("Correo y/o contraseña incorrectos");
    } else {
      res.sendStatus(200);
      console.log("Inicio de sesión exitoso");
    }
  } catch (error) {
    res.send(error);
  }
};
