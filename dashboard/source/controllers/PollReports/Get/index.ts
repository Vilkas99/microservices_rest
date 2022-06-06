import { Request, Response } from "express";
import { isUUID } from "../../../utils/functions";

const PollReportsModel = require("../../../models/PollReports");

function isString(x: any) {
  return Object.prototype.toString.call(x) === "[object String]";
}

// Endpoint que obtiene las preguntas en orden de una encuesta dado un tipo de encuesta
export const getPollReportController = async (req: Request, res: Response) => {
  enum ESurveyType {
    advisor = "advisor",
    student = "student",
  }

  const { idAppointment } = req.query;

  if (idAppointment === undefined) {
    res.status(400).send("Error: idAppointment is undefined");
    return;
  }

  if (!isString(idAppointment)) {
    res.status(400).send("Error: idAppointment is not a string");
    return;
  } else if (idAppointment === "") {
    res.status(400).send("Error: idAppointment was not provided by client");
    return;
  }

  if (!isUUID(idAppointment)) {
    res.status(400).send("idAppointment is not a valid UUID.");
    return;
  }

  try {
    const idObject: any = await PollReportsModel.query()
      .select("id")
      .from("poll-reports")
      .where("id_appointment", idAppointment);

    if (idObject === undefined || idObject.length === 0) {
      res.status(404).send("Error: Poll report not found.");
      return;
    }

    const pollReportStudent: any = await PollReportsModel.query()
      .select("question", "answer")
      .from("poll-reports")
      .where("id_appointment", idAppointment)
      .where("survey_type", ESurveyType.student.toString());

    const pollReportAdvisor: any = await PollReportsModel.query()
      .select("question", "answer")
      .from("poll-reports")
      .where("id_appointment", idAppointment)
      .where("survey_type", ESurveyType.advisor.toString());

    const jsonToSend = {
      student: pollReportStudent,
      advisor: pollReportAdvisor,
    };

    res.json(jsonToSend);
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};
