import { Request, Response } from "express";
import { uuid } from "uuidv4";

const ScheduleModel = require("../../../models/Schedules");

function addHours(numOfHours: number, date = new Date()) {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

  return date;
}

export const createSchedule = async (req: Request, res: Response) => {
  const { advisor, period, day } = req.body;

  const start = new Date();
  const finish = addHours(2);

  const id = uuid();

  try {
    await ScheduleModel.query().insert({
      id,
      advisor,
      start,
      finish,
      period,
      day,
    });
    res.status(200);
    res.send("Ok");
  } catch (error) {
    res.send(error);
    res.status(400);
    console.error(error);
  }
};
