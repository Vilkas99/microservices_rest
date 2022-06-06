import { isNumber, isUserAdmin } from "../../../utils/functions/index";
import { Request, Response } from "express";
import redisClient from "../../../redis";
import { paramNotPresent } from "../../../utils/functions";
import { isString, isBoolean, isUUID } from "../../../utils/functions";

const CareersModel = require("../../../models/Careers");

const updateCareerWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("updateCareer", body);
  }
};

export const updateCareerController = async (req: Request, res: Response) => {
  const { name, acronym, doubleDegree, length, idAdmin } = req.body;

  if (paramNotPresent(name, res, "name")) return;
  if (paramNotPresent(acronym, res, "acronym")) return;
  if (paramNotPresent(doubleDegree, res, "doubleDegree")) return;
  if (paramNotPresent(length, res, "length")) return;
  if (paramNotPresent(idAdmin, res, "idAdmin")) return;

  if (!isString(name)) {
    res.status(400).send("Error: name is not a string");
    return;
  }

  if (!isString(acronym)) {
    res.status(400).send("Error: acronym is not a string");
    return;
  }

  if (!isString(idAdmin)) {
    res.status(400).send("Error: idAdmin is not a string");
    return;
  }

  if (!isBoolean(doubleDegree)) {
    res.status(400).send("Error: doubleDegree is not a string");
    return;
  }

  if (!isNumber(length)) {
    res.status(400).send("Error: length is not a string");
    return;
  }

  if (!isUUID(idAdmin)) {
    res.status(400).send("Error: idAdmin is not a uuid");
    return;
  }

  if (!(await isUserAdmin(idAdmin))) {
    res.status(400).send("Error: user is not admin");
    return;
  }

  try {
    const careerExists = await CareersModel.query()
      .select()
      .from("careers")
      .where("acronym", acronym);

    console.log(careerExists.length);
    if (careerExists === undefined && careerExists.length === 0) {
      res.status(400).send("Error: the career does not exist");
      return;
    }

    await CareersModel.query()
      .from("careers")
      .where("acronym", acronym)
      .update({
        name: name,
        doubleDegree: doubleDegree,
        length: length,
      });

    await updateCareerWebSocket(idAdmin, req.body);

    res.status(200).send("Action completed: A career has been updated");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
