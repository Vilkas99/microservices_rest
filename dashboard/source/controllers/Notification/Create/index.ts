import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../../redis";
import { paramNotPresent } from "../../../utils/functions";

const NotificationModel = require("../../../models/Notification");

const createNotificationWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("newNotification", body);
  }
};

export const createNotification = async (req: Request, res: Response) => {
  enum ENotificationTyppe {
    "APPOINTMENT_ACCEPTED" = "APPOINTMENT_ACCEPTED",
    "APPOINTMENT_REJECTED" = "APPOINTMENT_REJECTED",
    "APPOINTMENT_COMPLETED" = "APPOINTMENT_COMPLETED",
    "NEW_REQUEST" = "NEW_REQUEST",
    "MESSAGE" = "MESSAGE",
  }

  const { title, description, idUser, type } = req.body;

  if (paramNotPresent(title, res, "title")) return;
  if (paramNotPresent(description, res, "description")) return;
  if (paramNotPresent(idUser, res, "idUser")) return;
  if (paramNotPresent(type, res, "type")) return;

  if (!Object.values(ENotificationTyppe).includes(type)) {
    res
      .status(400)
      .send("Error: Type value is different than the enum associated with it.");
    return;
  }

  try {
    await NotificationModel.query().insert({
      id: uuidv4(),
      title,
      description,
      id_user: idUser,
      status: "not seen",
    });

    await createNotificationWebSocket(idUser, req.body);

    res.status(200).send("Action completed: A notification has been created");
  } catch (error) {
    res.status(500).send(error);
  }
};
