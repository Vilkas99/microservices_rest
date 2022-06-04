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

  try {
    const careerSubject: any = await SubjectModel.query()
      .select("subjects.id", "subjects.name", "subjects.acronym")
      .from("career-subject")
      .innerJoin("subjects", "career-subject.id_subject", "subjects.id")
      .where("career-subject.id_career", idCarrera)
      .andWhere("career-subject.semester", "<=", semester)
      .orWhere(
        "career-subject.id_career",
        "b2a9a7c6-cc4f-4507-b70f-6bdb7488e748"
      );

    if (careerSubject === undefined || careerSubject.length === 0) {
      res.status(404).send("Error: Subjects not found.");
      return;
    }

    res.json(careerSubject);
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllSubjectsController = async (req: Request, res: Response) => {
  const { page, limitItems } = req.query;
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
  }

  try {
    const numberQueries: any = await SubjectModel.query()
      .count("id")
      .from("subjects");

    console.log(numberQueries);

    const subjects: any = await db.raw(
      `SELECT subjects.acronym as subjectAcronym`
    );
    // .select(
    //   "subjects.acronym as subjectAcronym",
    //   "subjects.name",
    //   "careers.acronym as careerAcronym",
    //   "subjects.semester"
    // )
    // .from("subjects")
    // // .limit(limitItems)
    // // .offset(off)
    // .innerJoin("career-subject", "career-subject.id_subject", "subjects.id")
    // .innerJoin("careers", "career-subject.id_career", "careers.id");

    if (subjects === undefined || subjects.length === 0) {
      res.status(404).send("Error: Subjects not found.");
      return;
    }

    res.json(subjects);
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};
