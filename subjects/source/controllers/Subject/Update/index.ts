import { isUserAdmin } from "./../../../utils/functions/index";
import { Request, Response } from "express";
import redisClient from "../../../redis";
import { paramNotPresent } from "../../../utils/functions";
import { isString, isBoolean, isUUID } from "../../../utils/functions";

const SubjectModel = require("../../../models/Subjects");

const updateSubjectWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("subjectUpdated", body);
  }
};

export const updateSubjectController = async (req: Request, res: Response) => {
  const { id, name, acronym, availability, englishName, idAdmin } = req.body;

  if (paramNotPresent(id, res, "id")) return;
  if (paramNotPresent(name, res, "name")) return;
  if (paramNotPresent(acronym, res, "acronym")) return;
  if (paramNotPresent(availability, res, "availability")) return;
  if (paramNotPresent(englishName, res, "englishName")) return;
  if (paramNotPresent(idAdmin, res, "idAdmin")) return;

  if (!isString(id)) {
    res.status(400).send("Error: id is not a string");
    return;
  }

  if (!isUUID(id)) {
    res.status(400).send("Error: id is not uuid");
    return;
  }

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
      .where("id", id);

    if (subjectExists === undefined || subjectExists.length === 0) {
      res.status(400).send("Error: the subject does not exist");
      return;
    }

    await SubjectModel.query().from("subjects").where("id", id).update({
      name: name,
      acronym: acronym,
      availability: availability,
      englishName: englishName,
    });

    await updateSubjectWebSocket(idAdmin, req.body);

    res
      .status(200)
      .send(
        "Action completed: The subject with id " + id + " has been updated"
      );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
