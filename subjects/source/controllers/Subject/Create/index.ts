import { isUserAdmin } from "./../../../utils/functions/index";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../../../db/db";
import redisClient from "../../../redis";
import { paramNotPresent } from "../../../utils/functions";
import { isString, isBoolean, isUUID } from "../../../utils/functions";

const SubjectModel = require("../../../models/Subjects");

const createSubjectWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("newSubject", body);
  }
};

export const createSubjectController = async (req: Request, res: Response) => {
  const { name, acronym, availability, englishName, idAdmin } = req.body;

  if (paramNotPresent(name, res, "name")) return;
  if (paramNotPresent(acronym, res, "acronym")) return;
  if (paramNotPresent(availability, res, "availability")) return;
  if (paramNotPresent(englishName, res, "englishName")) return;
  if (paramNotPresent(idAdmin, res, "idAdmin")) return;

  if (!isString(name)) {
    res.status(400).send("Error: name is not a string");
    return;
  }

  if (!isString(acronym)) {
    res.status(400).send("Error: acronym is not a string");
    return;
  }

  if (!isString(englishName)) {
    res.status(400).send("Error: englishName is not a string");
    return;
  }

  if (!isBoolean(availability)) {
    res.status(400).send("Error: availability is not a boolean");
    return;
  }

  if (!isUUID(idAdmin)) {
    res.status(400).send("Error: idAmdin is not a uuid");
    return;
  }

  if (!(await isUserAdmin(idAdmin))) {
    res.status(400).send("Error: user is not admin");
    return;
  }

  try {
    const subjectExists = await SubjectModel.query()
      .select()
      .from("subjects")
      .where("name", name)
      .orWhere("acronym", acronym);

    if (subjectExists !== undefined && subjectExists.length !== 0) {
      res.status(400).send("Error: the subject already exists");
      return;
    }

    await SubjectModel.query().insert({
      id: uuidv4(),
      name: name,
      acronym: acronym,
      availability: availability,
      englishName: englishName,
    });

    await createSubjectWebSocket(idAdmin, req.body);

    res.status(200).send("Action completed: A subject has been created");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
