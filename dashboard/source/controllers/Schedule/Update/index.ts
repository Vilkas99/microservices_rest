import { Request, Response } from "express";
import { uuid } from "uuidv4";
import { getDay } from "date-fns";
import { parseISO } from "date-fns";

const ScheduleModel = require("../../../models/Schedules");

interface ISchedulesUpdateReq {
  id: string;
  title: string;
  isAllDay: boolean;
  start: any;
  end: any;
  category: string;
  dueDateClass: string;
  location: string;
  raw: any;
  isVisible: boolean;
  state: string;
}

interface IScheduelArrayUpdate {
  schedules: Array<ISchedulesUpdateReq>;
  idAdvisor: string;
  period: string;
}

export const updateSchedule = async (req: Request, res: Response) => {
  const { schedules, idAdvisor, period } = req.body as IScheduelArrayUpdate;

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  const error = false;

  await ScheduleModel.query().delete().where({
    advisor: idAdvisor,
  });

  await schedules.forEach(async (schedule) => {
    const id = uuid();

    const newStart = new Date(Date.parse(schedule.start));
    const newEnd = new Date(Date.parse(schedule.end));

    const day = days[getDay(newStart) - 1];

    console.log("Inicio: ", newStart);
    console.log("Final: ", newEnd);
    console.log("Final chafon: ", schedule.end);
    console.log("-----------------");

    try {
      await ScheduleModel.query().insert({
        id,
        advisor: idAdvisor,
        start: newStart,
        finish: newEnd,
        period: period,
        day,
      });
    } catch (error) {
      console.log("MAMORGAN");
      res.send(error);
      res.status(400);
      console.error(error);
      error = true;
    }
  });
};
