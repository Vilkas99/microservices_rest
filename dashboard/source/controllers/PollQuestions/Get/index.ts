import { Request, Response } from "express";

const QuestionModel = require("../../../models/Question");

// Endpoint que obtiene las preguntas en orden de una encuesta dado un tipo de encuesta
export const getQuestionController = async (req: Request, res: Response) => {
  enum EUserType {
    advisor = "advisor",
    student = "student",
  }

  const { id_type } = req.query;

  if (!Object.values(EUserType).includes(id_type as EUserType)) {
    res
      .status(400)
      .send(
        "Error: survey_type value is different than the enum associated with it."
      );
    return;
  }

  try {
    const questionsPoll: any = await QuestionModel.query()
      .select("title as question", "type")
      .from("questions")
      .where("survey_type", id_type?.toString())
      .orderBy("order", "asc");

    if (questionsPoll === undefined) {
      res.status(404).send("Error: Questions not found.");
      return;
    }

    if (questionsPoll.length === 0) {
      res.status(200).send("No questions were found for this survey_type");
      return;
    }

    res.json(questionsPoll);
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};
