import { isUserAdmin } from "./../../../utils/functions/index";
import { Request, Response } from "express";
import redisClient from "../../../redis";
import { paramNotPresent } from "../../../utils/functions";
import { isString, isBoolean, isUUID } from "../../../utils/functions";

const SubjectModel = require("../../../models/Subjects");

const deleteSubjectWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("subjectDeleted", body);
  }
};

export const deleteSubjectController = async (req: Request, res: Response) => {
  const { id, idAdmin } = req.body;

  if (paramNotPresent(id, res, "id")) return;
  if (paramNotPresent(idAdmin, res, "idAdmin")) return;

  if (!isString(id)) {
    res.status(400).send("Error: id is not a string");
    return;
  }

  if (!isUUID(id)) {
    res.status(400).send("Error: id is not uuid");
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

    await SubjectModel.query().from("subjects").where("id", id).del();

    await deleteSubjectWebSocket(idAdmin, req.body);

    res
      .status(200)
      .send(
        "Action completed: The subject with id " + id + " has been deleted"
      );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
