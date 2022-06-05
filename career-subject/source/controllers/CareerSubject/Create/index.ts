import { isNumber, isUserAdmin } from "../../../utils/functions/index";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../../redis";
import { paramNotPresent } from "../../../utils/functions";
import { isString, isBoolean, isUUID } from "../../../utils/functions";

const SubjectModel = require("../../../models/Subjects");
const SubjectCareerModel = require("../../../models/SubjectCareer");

const createCareerSubjectWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("newCareerSubject", body);
  }
};

export const createCareerSubjectController = async (
  req: Request,
  res: Response
) => {
  const { idCareer, idSubject, semester, idAdmin } = req.body;

  if (paramNotPresent(idCareer, res, "idCareer")) return;
  if (paramNotPresent(idSubject, res, "idSubject")) return;
  if (paramNotPresent(semester, res, "semester")) return;
  if (paramNotPresent(idAdmin, res, "idAdmin")) return;

  if (!isString(idCareer)) {
    res.status(400).send("Error: idCareer is not a string");
    return;
  }

  if (!isString(idSubject)) {
    res.status(400).send("Error: idSubject is not a string");
    return;
  }

  if (!isNumber(semester)) {
    res.status(400).send("Error: semester is not a string");
    return;
  }

  if (!isUUID(idCareer)) {
    res.status(400).send("Error: idCareer is not a uuid");
    return;
  }

  if (!isUUID(idSubject)) {
    res.status(400).send("Error: idSubject is not a uuid");
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
    const subjectExists = await SubjectModel.query()
      .select()
      .from("subjects")
      .where("id", idSubject);

    if (subjectExists === undefined && subjectExists.length === 0) {
      res.status(400).send("Error: the subject does not exist");
      return;
    }

    const careertExists = await SubjectModel.query()
      .select()
      .from("careers")
      .where("id", idCareer);

    if (careertExists === undefined && careertExists.length === 0) {
      res.status(400).send("Error: the career does not exist");
      return;
    }

    await SubjectCareerModel.query().insert({
      id: uuidv4(),
      id_career: idCareer,
      id_subject: idSubject,
      semester: semester,
    });

    await createCareerSubjectWebSocket(idAdmin, req.body);

    res
      .status(200)
      .send("Action completed: A relation career-subject has been created");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
