import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
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

  const { answers, idAppointment, surveyType } = req.body;

  if (
    (answers &&
      Object.keys(answers).length === 0 &&
      Object.getPrototypeOf(answers) === Object.prototype) ||
    answers === undefined ||
    answers === null
  ) {
    res.status(400).send("Error: No answers/questions were provided");
    return;
  }

  if (paramNotPresent(idAppointment, res, "idAppointment")) return;
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
    const appointmentObject: any = await QuestionModel.query()
      .select("id")
      .from("appointments")
      .where("id", idAppointment);
    if (appointmentObject === undefined || appointmentObject.length === 0) {
      res.status(404).send("Error: Appointment not found.");
      return;
    }

    const idUserObject: any = await QuestionModel.query()
      .select("id_student", "id_advisor")
      .from("appointments-user")
      .where("id_appointment", idAppointment);
    if (idUserObject === undefined || idUserObject.length === 0) {
      res.status(404).send("Error: Appointment-user not found.");
      return;
    }

    const pollReportObject: any = await QuestionModel.query()
      .select("id")
      .from("poll-reports")
      .where("id_appointment", idAppointment)
      .where("survey_type", surveyType);
    if (pollReportObject.length !== 0) {
      res.status(404).send("Error: Poll appointment already answered.");
      return;
    }

    for (var question in answers) {
      await QuestionModel.query().insert({
        id: uuidv4(),
        answer: answers[question],
        question,
        id_appointment: idAppointment,
        survey_type: surveyType,
      });
    }

    const idUser =
      surveyType === ESurveyType.advisor
        ? idUserObject[0]["id_advisor"]
        : idUserObject[0]["id_student"];

    await createPollQuestionstWebSocket(idUser, req.body);

    res.status(200).send("Action completed: A pollReport has been created");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
