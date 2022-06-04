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
  const { idCarrera, page, limitItems } = req.query;
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
    const subjectCareer: any = await SubjectModel.query()
      .select(
        "subjects.id",
        "subjects.acronym",
        "subjects.name",
        "career-subject.semester"
      )
      .from("career-subject")
      .innerJoin("subjects", "career-subject.id_subject", "subjects.id")
      .where("career-subject.id_career", idCarrera)
      .limit(limitItems)
      .offset(off);

    if (subjectCareer === undefined || subjectCareer.length === 0) {
      res.status(404).send("Error: Subjects not found.");
      return;
    }

    res.json(subjectCareer);
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getSubjectCareerSemesterController = async (
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
    const numberSubjects: any = await SubjectModel.query()
      .count("id")
      .from("subjects");

    const subjects: any = await db.raw(
      `SELECT materias.acronym as subjectAcronym,
      materias.id,
      materias.name,
      careers.acronym as careerAcronym,
      "career-subject".semester FROM (SELECT * FROM subjects LIMIT ${limitItems} OFFSET ${off}) AS materias
      INNER JOIN "career-subject" ON "career-subject".id_subject = materias.id
      INNER JOIN careers ON "career-subject".id_career = careers.id`
    );

    if (
      subjects === undefined ||
      subjects.length === 0 ||
      subjects.rows === undefined ||
      subjects.rows.length === 0
    ) {
      res.status(404).send("Error: Subjects not found.");
      return;
    }

    let materias: any = [];
    subjects.rows.forEach((element: any) => {
      const elementInMaterias = materias.findIndex(
        (materia: any) => element.id === materia.id
      );
      if (elementInMaterias != -1) {
        materias[elementInMaterias].careeracronym.push(element.careeracronym);
        const semesterInMateria: any = materias[
          elementInMaterias
        ].semester.includes(element.semester);
        if (!semesterInMateria) {
          materias[elementInMaterias].semester.push(element.semester);
        }
      } else {
        materias.push({
          id: element.id,
          subjectacronym: element.subjectacronym,
          name: element.name,
          careeracronym: [element.careeracronym],
          semester: [element.semester],
        });
      }
    });

    res.json({ materias: materias, count: +numberSubjects[0].count });
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};