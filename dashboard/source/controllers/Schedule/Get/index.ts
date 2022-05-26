import { Request, Response } from "express";

const ScheduleModel = require("../../../models/Schedules");

function isString(x: any) {
  return Object.prototype.toString.call(x) === "[object String]";
}

export const getAllSchedules = async (req: Request, res: Response) => {
  const { idUser } = req.query;

  if (!isString(idUser)) res.status(400).send("Error: Id is not a string");
  else if (idUser === "") {
    res.status(400).send("Error: Id was not provided by client");
    return;
  }

  try {
    const schedules = await ScheduleModel.query().where({ advisor: idUser });
    res.json(schedules);
    res.status(200);
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
};
