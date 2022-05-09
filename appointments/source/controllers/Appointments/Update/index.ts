import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

enum EStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}
interface IAppointmentData extends IAppointmentDataMod {
  id: string;
  created_at: Date;
  updated_at: Date;
}

interface IAppointmentDataMod {
  date?: string | Date;
  id_subject?: string;
  status?: EStatus;
  location?: string;
  problem_description?: string;
  photo_url?: string;
}

interface IIdsAppointmentData extends IIdsAppointmentDataMod {
  id: string;
  id_appointment: string;
}

interface IIdsAppointmentDataMod {
  id_student?: string;
  id_advisor?: string;
  id_admin?: string;
}

interface IUpdateaAppointment {
  id: string;
  newValues?: IAppointmentDataMod;
  newIds?: IIdsAppointmentDataMod;
}

export const updateController = async (req: Request, res: Response) => {
  const { id, newValues, newIds }: IUpdateaAppointment = req.body;

  if (newValues?.date !== undefined && typeof newValues.date === "string") {
    newValues.date = new Date(Date.parse(newValues?.date as string));
  }

  try {
    await db("appointments").where("id", id).update(newValues);
    res.sendStatus(200);
  } catch (error) {
    res.send(error);
  }

  if (newIds !== undefined) {
    const keysIds = Object.keys(newIds);
    keysIds.map((key) => {
      //TODO: Send notification to each id that will be changed
    });
  }
};
