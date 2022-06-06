import { Request, Response } from "express";
import redisClient from "../../../redis";
import { isBoolean, isString, isUser, isUUID } from "../../../utils/functions";

const QuestionModel = require("../../../models/Question");

const getPollQuestionsWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("getCareerSubjects", body);
  }
};

// Endpoint que obtiene las preguntas en orden de una encuesta dado un tipo de encuesta
export const getQuestionController = async (req: Request, res: Response) => {
  enum EUserType {
    advisor = "advisor",
    student = "student",
  }

  const { id_type, idUser } = req.query;

  if (idUser === undefined) {
    res.status(400).send("Error: idUser is undefined");
    return;
  }

  if (!isString(idUser)) {
    res.status(400).send("Error: idUser is not a string");
    return;
  } else if (idUser === "") {
    res.status(400).send("Error: idUser was not provided by client");
    return;
  }

  if (!isUUID(idUser)) {
    res.status(400).send("idUser is not a valid UUID.");
    return;
  }

  if (!(await isUser(idUser))) {
    res.status(400).send("Error: user is not logged in");
    return;
  }

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

    await getPollQuestionsWebSocket(idUser.toString(), req.body);

    res.json(questionsPoll);
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};
