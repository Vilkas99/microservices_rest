import { isNumber, isUserAdmin } from "../../../utils/functions/index";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../../redis";
import { paramNotPresent } from "../../../utils/functions";
import { isString, isBoolean, isUUID } from "../../../utils/functions";

const CareersModel = require("../../../models/Careers");

const createCareerWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("newCareer", body);
  }
};

export const createCareerController = async (req: Request, res: Response) => {
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

    if (careerExists === undefined || careerExists.length !== 0) {
      res.status(400).send("Error: the career already exists");
      return;
    }

    await CareersModel.query().insert({
      id: uuidv4(),
      name: name,
      acronym: acronym,
      doubleDegree: doubleDegree,
      length: length,
    });

    await createCareerWebSocket(idAdmin, req.body);

    res.status(200).send("Action completed: A career has been created");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
