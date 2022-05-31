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
  scheduleOne: Array<ISchedulesUpdateReq>;
  scheduleTwo: Array<ISchedulesUpdateReq>;
  scheduleThree: Array<ISchedulesUpdateReq>;
  idAdvisor: string;
}

const updateSchedulesDatabase = async (
  schedules: Array<ISchedulesUpdateReq>,
  res: Response,
  idAdvisor: string,
  period: string
) => {
  await schedules.forEach(async (schedule) => {
    console.log("Actualizando horarios...");
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    const id = uuid();

    const newStart = new Date(Date.parse(schedule.start));
    const newEnd = new Date(Date.parse(schedule.end));

    const day = days[getDay(newStart) - 1];

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
      res.send(error);
      res.status(400);
      console.error(error);
      error = true;
    }
  });
};

export const updateSchedule = async (req: Request, res: Response) => {
  const { scheduleOne, scheduleTwo, scheduleThree, idAdvisor } =
    req.body as IScheduelArrayUpdate;

  await ScheduleModel.query().delete().where({
    advisor: idAdvisor,
  });

  await updateSchedulesDatabase(scheduleOne, res, idAdvisor, "0");
  await updateSchedulesDatabase(scheduleTwo, res, idAdvisor, "1");
  await updateSchedulesDatabase(scheduleThree, res, idAdvisor, "2");

  res.status(200).send("Ok");
};
