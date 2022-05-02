import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

interface IUserGetData {
  id: string;
}
export const getUserData = async (req: Request, res: Response) => {
  const { id }: IUserGetData = req.body;

  try {
    let userQuery: any;
    userQuery = await db("users").where({ id: id });
    let userData = userQuery[0];
    res.send(userData);
  } catch (error) {
    res.send(error);
  }
};
