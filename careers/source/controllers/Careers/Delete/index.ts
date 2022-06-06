import { isNumber, isUserAdmin } from "../../../utils/functions/index";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../../redis";
import { paramNotPresent } from "../../../utils/functions";
import { isString, isBoolean, isUUID } from "../../../utils/functions";

const CareersModel = require("../../../models/Careers");

const deleteCareerWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("deletedCareer", body);
  }
};

export const deleteCareerController = async (req: Request, res: Response) => {
  const { acronym, idAdmin } = req.body;

  if (paramNotPresent(acronym, res, "acronym")) return;
  if (paramNotPresent(idAdmin, res, "idAdmin")) return;

  if (!isString(acronym)) {
    res.status(400).send("Error: acronym is not a string");
    return;
  }

  if (!isString(idAdmin)) {
    res.status(400).send("Error: idAdmin is not a string");
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
      .select("id")
      .from("careers")
      .where("acronym", acronym);

    if (careerExists === undefined || careerExists.length === 0) {
      res.status(400).send("Error: the career does not exist");
      return;
    }

    await CareersModel.query()
      .from("career-subject")
      .where("id_career", careerExists[0].id)
      .del();

    await CareersModel.query().from("careers").where("acronym", acronym).del();

    await deleteCareerWebSocket(idAdmin, req.body);

    res.status(200).send("Action completed: A career has been deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
