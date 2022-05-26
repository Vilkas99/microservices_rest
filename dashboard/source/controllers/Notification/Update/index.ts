import { Request, Response } from "express";
import { paramNotPresent } from "../../../utils/functions";

const NotificationModel = require("../../../models/Notification");

enum ENotificationStatus {
  seen = "seen",
  not_seen = "not seen",
  deleted = "deleted",
}

const isUUID = (uuid: string) => {
  return uuid.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
};

export const updateNotification = async (req: Request, res: Response) => {
  const { idNotification, status } = req.body;

  if (paramNotPresent(idNotification, res, "idNotification")) return;
  if (paramNotPresent(status, res, "Status")) return;

  if (!isUUID(idNotification)) {
    res.status(400).send("IdNotification is not a valid UUID.");
    return;
  }

  if (!Object.values(ENotificationStatus).includes(status)) {
    res
      .status(400)
      .send(
        "Error: Status value is different than the enum associated with it."
      );
    return;
  }

  try {
    await NotificationModel.query()
      .findById(idNotification)
      .patch({ status: status });

    res.status(200).send("Update completed");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
