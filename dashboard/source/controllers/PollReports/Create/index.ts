import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../../redis";
import { paramNotPresent } from "../../../utils/functions";

const PollReportsModel = require("../../../models/PollReports");
const AppointmentModel = require("../../../models/Appointment");
const AppointmentUserModel = require("../../../models/AppointmentUser");

const createPollReportWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("newPollReport", body);
  }
};

// Endpoint que crea un reporte de respuestas de encuesta para una asesoría, para el asesor o asesorado

export const createPollReportController = async (
  req: Request,
  res: Response
) => {
  enum ESurveyType {
    advisor = "advisor",
    student = "student",
  }
  enum EQuestionType {
    text = "text",
    scale = "scale",
    yesOrNo = "yesOrNo",
  }

  const { questionsArray, surveyType } = req.body;

  if (
    (questionsArray &&
      Object.keys(questionsArray).length === 0 &&
      Object.getPrototypeOf(questionsArray) === Object.prototype) ||
    questionsArray === undefined ||
    questionsArray === null
  ) {
    res.status(400).send("Error: No questions were provided");
    return;
  }

  if (paramNotPresent(questionsArray, res, "questions")) return;
  if (paramNotPresent(surveyType, res, "surveyType")) return;
  if (!Object.values(ESurveyType).includes(surveyType as ESurveyType)) {
    res
      .status(400)
      .send(
        "Error: survey_type value is different than the enum associated with it."
      );
    return;
  }

  try {
    for (var question in questionsArray) {
    }
    for (var question in questionsArray) {
      await PollReportsModel.query().insert({
        id: uuidv4(),
        answer: questionsArray[question],
        question,
        id_appointment: questionsArray,
        survey_type: surveyType,
      });
    }

    res.status(200).send("Action completed: A pollReport has been created");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
