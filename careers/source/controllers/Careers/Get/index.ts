import { Request, Response } from "express";
import db from "../../../db/db";
import redisClient from "../../../redis";
import { isBoolean, isString, isUser, isUUID } from "../../../utils/functions";

const CareersModel = require("../../../models/Careers");

const getCareersWebSocket = async (idUser: string, body: any) => {
  const socketId = await redisClient.get(idUser, (err: any, reply: any) => {
    if (err) throw err;
    return reply;
  });

  if (socketId !== null) {
    require("../../../server").io.to(socketId).emit("getCareerSubjects", body);
  }
};

export const getCareerController = async (req: Request, res: Response) => {
  const { id, idUser } = req.query;

  if (!isString(id)) res.status(400).send("Error: id is not a string");
  else if (id === "") {
    res.status(400).send("Error: id was not provided by client");
    return;
  }

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

  try {
    const career: any = await CareersModel.query()
      .select("id", "name", "acronym", "doubleDegree", "length")
      .from("careers")
      .where("id", id);

    if (career === undefined || career.length === 0) {
      res.status(404).send("Error: Career not found.");
      return;
    }

    await getCareersWebSocket(idUser.toString(), req.body);

    res.json(career);
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getCareerDoubleDegreeController = async (
  req: Request,
  res: Response
) => {
  try {
    const career: any = await CareersModel.query()
      .select("id", "name", "acronym")
      .from("careers")
      .where("doubleDegree", true);

    if (career === undefined || career.length === 0) {
      res.status(404).send("Error: Careers not found.");
      return;
    }

    res.json(career);
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllCareersController = async (req: Request, res: Response) => {
  try {
    const careers: any = await CareersModel.query()
      .select("id", "name", "acronym")
      .from("careers");

    if (careers === undefined || careers.length === 0) {
      res.status(404).send("Error: Careers not found.");
      return;
    }

    res.json(careers);
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllCareersPaginatedController = async (
  req: Request,
  res: Response
) => {
  const { page, limitItems, idAdmin } = req.query;

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

  if (!limitItems) {
    res.status(404).send("Error: itemsLimit should not be 0.");
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
  } else {
    res.status(404).send("Error: page and limitItems should not be 0.");
    return;
  }

  try {
    const careers: any = await CareersModel.query()
      .select("id", "name", "acronym", "doubleDegree", "length")
      .from("careers")
      .limit(limitItems)
      .offset(off);

    if (careers === undefined || careers.length === 0) {
      res.status(404).send("Error: Careers not found.");
      return;
    }

    await getCareersWebSocket(idAdmin.toString(), req.body);

    res.json(careers);
    res.statusCode = 200;
  } catch (error) {
    res.status(500).send(error);
  }
};
