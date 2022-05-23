import { Request, Response } from "express";
import db from "../../../db/db";

const AppointmentModel = require("../../../models/Appointment");
const AppointmentUserModel = require("../../../models/AppointmentUser");
const SubjectsModel = require("../../../models/Subjects");

export const deleteAppointment = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    await db("appointments").where("id", id).del();
    res.sendStatus(200);
  } catch (error) {
    res.send(error);
  }
};
