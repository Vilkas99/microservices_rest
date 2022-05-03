import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

export const updateDetailsController = async (req: Request, res: Response) => {
  const { id, newValue, fieldToBeChanged } = req.body!;

  const change = JSON.parse(`{"${fieldToBeChanged}": "${newValue}"}`);
  try {
    console.log(fieldToBeChanged);
    console.log(newValue);
    await db("appointments-user").where("id_appointment", id).update(change);
    res.sendStatus(200);
  } catch (error) {
    res.send(error);
  }
};
