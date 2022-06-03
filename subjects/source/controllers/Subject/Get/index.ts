import { Request, Response } from "express";
import db from "../../../db/db";

const SubjectModel = require("../../../models/Subjects");
const SubjectCareerModel = require("../../../models/SubjectCareer");

function isString(x: any) {
  return Object.prototype.toString.call(x) === "[object String]";
}

function isNumber(n: any) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

const isUUID = (uuid: any) => {
  return uuid.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
};

export const getSubjectCareerController = async (
  req: Request,
  res: Response
) => {
  const { idCarrera, semester } = req.query;

  if (!isString(idCarrera))
    res.status(400).send("Error: idCarrera is not a string");
  else if (idCarrera === "") {
    res.status(400).send("Error: idCarrera was not provided by client");
    return;
  }

  if (!isUUID(idCarrera)) {
    res.status(400).send("idCarrera is not a valid UUID.");
    return;
  }

  if (!isNumber(semester))
    res.status(400).send("Error: semester is not a number");
  else if (semester === "") {
    res.status(400).send("Error: semester was not provided by client");
    return;
  }

  const careerObject: any = await SubjectCareerModel.query()
    .select("id")
    .from("careers")
    .where("id", idCarrera);
  if (careerObject === undefined || careerObject.length === 0) {
    res.status(404).send("Error: Career not found.");
    return;
  }

  db.raw(
    `SELECT subjects.id, subjects.name, subjects.acronym FROM "career-subject" INNER JOIN subjects ON 
    "career-subject".id_subject = subjects.id
    WHERE "career-subject".id_career = '${idCarrera}'
    AND subjects.semester <= '${semester}'
    OR "career-subject".id_career = 'b2a9a7c6-cc4f-4507-b70f-6bdb7488e748'`
  ).then((resp) => {
    if (resp.rows === undefined || resp.rows.length === 0) {
      res
        .status(404)
        .send("Error: Subjects for career and semester not found.");
      return;
    }
    res.status(200);
    res.json(resp.rows);
  });

  try {
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllSubjectsController = async (
  req: Request,
  res: Response
) => {};
