import { Request, Response } from "express";

const UserModel = require("../../../models/User");

export const getUserConfiguration = async (req: Request, res: Response) => {
  const { idUser } = req.query;

  function isString(x: any) {
    return Object.prototype.toString.call(x) === "[object String]";
  }

  if (!isString(idUser)) res.status(400).send("Error: Id is not a string");
  else if (idUser === "") {
    res.status(400).send("Error: Id was not provided by client");
    return;
  }

  try {
    const configuration = await UserModel.query()
      .select("configuration")
      .where({ id: idUser });
    res.json(configuration);
    res.status(200);
  } catch (error) {
    res.status(500).send(error);
  }
};
