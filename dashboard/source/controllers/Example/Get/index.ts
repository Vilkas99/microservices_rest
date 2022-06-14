import { Request, Response, NextFunction } from "express";

import db from "../../../db/db";

const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admins: any = await db("appointments").select();
    res.json(admins);
  } catch (error) {
    res.send(error);
    console.error("Error: ", error);
  }
};

const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id, full } = req.body!;

  try {
    let admin: any;

    if (full) {
      admin = await db("appointments").select().where("id", id);
    }
    res.json(admin);
  } catch (error) {
    res.send(error);
    console.error(error);
  }
};

export { getAllAdmins, getAdmin };
