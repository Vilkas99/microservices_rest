import { Request, Response } from "express";
import db from "../../../db/db";
import redisClient from "../../../redis";
import { isString, isUserAdmin, isUUID } from "../../../utils/functions";

const SubjectModel = require("../../../models/Subjects");
const SubjectCareerModel = require("../../../models/SubjectCareer");

const getCareerSubjectsWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("getCareerSubjects", body);
  }
};

export const getCareerSubjectsController = async (
  req: Request,
  res: Response
) => {
  const { idCareer, page, limitItems, idAdmin } = req.query;

  if (!isString(idCareer)) {
    res.status(400).send("Error: idCareer is not a string");
    return;
  } else if (idCareer === "") {
    res.status(400).send("Error: idCareer was not provided by client");
    return;
  }

  if (!isUUID(idCareer)) {
    res.status(400).send("idCareer is not a valid UUID.");
    return;
  }

  if (idAdmin === undefined) {
    res.status(400).send("Error: idAdmin is undefined");
    return;
  }

  if (!isString(idAdmin)) {
    res.status(400).send("Error: idAdmin is not a string");
    return;
  } else if (idAdmin === "") {
    res.status(400).send("Error: idAdmin was not provided by client");
    return;
  }

  if (!isUUID(idAdmin)) {
    res.status(400).send("idAdmin is not a valid UUID.");
    return;
  }

  if (!limitItems) {
    res.status(404).send("Error: itemsLimit should not be 0.");
    return;
  }

  if (!(await isUserAdmin(idAdmin))) {
    res.status(400).send("Error: user is not admin");
    return;
  }

  let off = 0;
  let p = 0;

  if (page && limitItems) {
    p = +page;
    if (p < 1) {
      res.status(404).send("Error: Index page incorrect.");
      return;
    } else {
      off = (+page - 1) * +limitItems;
    }
  } else {
    res.status(404).send("Error: page and limitItems should not be 0.");
    return;
  }

  try {
    const careerExists = await SubjectModel.query()
      .select()
      .from("careers")
      .where("id", idCareer);

    if (careerExists === undefined && careerExists.length === 0) {
      res.status(400).send("Error: the career does not exist");
      return;
    }

    const careerSubjects: any = await SubjectModel.query()
      .select("subjects.acronym", "subjects.name", "career-subject.semester")
      .from("career-subject")
      .innerJoin("subjects", "career-subject.id_subject", "subjects.id")
      .where("career-subject.id_career", idCareer)
      .limit(limitItems)
      .offset(off);

    if (careerSubjects === undefined) {
      res.status(404).send("Error: relation career-subject undefined.");
      return;
    }

    await getCareerSubjectsWebSocket(idAdmin.toString(), req.body);

    res.json(careerSubjects);
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};
