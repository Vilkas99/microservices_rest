import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  isBoolean,
  isString,
  isUser,
  isUserAdmin,
  isUUID,
} from "../../../utils/functions";
import redisClient from "../../../redis";
import { paramNotPresent } from "../../../utils/functions";

const QuestionModel = require("../../../models/Question");

const createPollQuestionstWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("newPollReport", body);
  }
};

// Endpoint que crea un reporte de respuestas de encuesta para una asesoría, para el asesor o asesorado

export const createPollQuestionsController = async (
  req: Request,
  res: Response
) => {
  enum ESurveyType {
    advisor = "advisor",
    student = "student",
  }

  enum EQuestionType {
    scale = "scale",
    text = "text",
    yesOrNo = "yesOrNo",
  }

  const { questions, surveyType, idAdmin } = req.body;

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

  if (!(await isUserAdmin(idAdmin))) {
    res.status(400).send("Error: user is not logged in");
    return;
  }

  if (paramNotPresent(surveyType, res, "surveyType")) return;
  if (!Object.values(ESurveyType).includes(surveyType as ESurveyType)) {
    res
      .status(400)
      .send(
        "Error: survey_type value is different than the enum associated with it."
      );
    return;
  }

  questions.forEach((element: any) => {
    if (element.title === undefined || element.title === "") {
      res.status(400).send("Error: title was not provided.");
      return;
    }

    if (element.order === undefined || element.order === null) {
      res.status(400).send("Error: order was not provided.");
      return;
    }

    if (!Object.values(EQuestionType).includes(element.type as EQuestionType)) {
      res
        .status(400)
        .send(
          "Error: questionType values different than the enum associated with it."
        );
      return;
    }
  });

  try {
    await QuestionModel.query()
      .from("questions")
      .where("survey_type", surveyType)
      .del();

    questions.forEach(async (element: any) => {
      await QuestionModel.query().insert({
        id: uuidv4(),
        title: element.title,
        order: element.order,
        survey_type: surveyType,
        type: element.type,
      });
    });

    await createPollQuestionstWebSocket(idAdmin, req.body);

    res.status(200).send("Action completed: questionsPoll has been created");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
