import { Request, Response } from "express";
import { paramNotPresent } from "../../../utils/functions";

const NotificationModel = require("../../../models/Notification");

function isString(x: any) {
  return Object.prototype.toString.call(x) === "[object String]";
}

export const getAllNotifications = async (req: Request, res: Response) => {
  const { idUser } = req.query;

  if (!isString(idUser)) res.status(400).send("Error: Id is not a string");
  else if (idUser === "") {
    res.status(400).send("Error: Id was not provided by client");
    return;
  }

  try {
    const notifications = await NotificationModel.query()
      .where({ id_user: idUser, status: "seen" })
      .orWhere({ id_user: idUser, status: "not seen" })
      .select();

    if (notifications === undefined) {
      res.status(404).send("Error: Notifications not found.");
      return;
    }

    res.json(notifications);
    res.status(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getNotification = async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!isString(id)) res.status(400).send("Error: Id is not a string");
  else if (id === "") {
    res.status(400).send("Error: Id was not provided by client");
    return;
  }

  try {
    const notification = await NotificationModel.query().findById(id);
    if (notification === undefined) {
      res.status(404).send("Error: Notification not found.");
      return;
    }
    res.json(notification);
    res.status(200);
  } catch (error) {
    res.status(500).send(error);
  }
};
