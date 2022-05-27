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

// Endpoint que obtiene las preguntas en orden de una encuesta dado un tipo de encuesta
export const createPollReportController = async (
  req: Request,
  res: Response
) => {
  enum ESurveyType {
    advisor = "advisor",
    student = "student",
  }

  const { answer, question, idAppointment, surveyType } = req.body;

  if (paramNotPresent(answer, res, "answer")) return;
  if (paramNotPresent(question, res, "question")) return;
  if (paramNotPresent(idAppointment, res, "id_appointment")) return;
  if (paramNotPresent(surveyType, res, "survey_type")) return;
  if (!Object.values(ESurveyType).includes(surveyType as ESurveyType)) {
    res
      .status(400)
      .send(
        "Error: survey_type value is different than the enum associated with it."
      );
    return;
  }

  try {
    const appointmentObject: any = await AppointmentModel.query()
      .select("id")
      .from("appointments")
      .where("id", idAppointment);
    if (appointmentObject === undefined || appointmentObject.length === 0) {
      res.status(404).send("Error: Appointment not found.");
      return;
    }

    const idUserObject: any = await AppointmentUserModel.query()
      .select("id_student", "id_advisor")
      .from("appointments-user")
      .where("id_appointment", idAppointment);
    if (idUserObject === undefined || idUserObject.length === 0) {
      res.status(404).send("Error: Appointment-user not found.");
      return;
    }

    const pollReportObject: any = await PollReportsModel.query()
      .select("id")
      .from("poll-reports")
      .where("answer", answer)
      .where("question", question)
      .where("id_appointment", idAppointment)
      .where("survey_type", surveyType);
    if (pollReportObject.length !== 0) {
      res.status(404).send("Error: Poll appointment already answered.");
      return;
    }

    await PollReportsModel.query().insert({
      id: uuidv4(),
      answer,
      question,
      id_appointment: idAppointment,
      survey_type: surveyType,
    });

    const idUser =
      surveyType === ESurveyType.advisor
        ? idUserObject[0]["id_advisor"]
        : idUserObject[0]["id_student"];

    await createPollReportWebSocket(idUser, req.body);

    res.status(200).send("Action completed: A pollReport has been created");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
