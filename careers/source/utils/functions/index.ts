import { Request, Response } from "express";
import db from "../../db/db";
import redisClient from "../../redis";

const {
  ValidationError,
  NotFoundError,
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} = require("objection");

export function errorHandler(err: any, res: Response) {
  if (err instanceof ValidationError) {
    switch (err.type) {
      case "ModelValidation":
        res.status(400).send({
          message: err.message,
          type: err.type,
          data: err.data,
        });
        break;
      case "RelationExpression":
        res.status(400).send({
          message: err.message,
          type: "RelationExpression",
          data: {},
        });
        break;
      case "UnallowedRelation":
        res.status(400).send({
          message: err.message,
          type: err.type,
          data: {},
        });
        break;
      case "InvalidGraph":
        res.status(400).send({
          message: err.message,
          type: err.type,
          data: {},
        });
        break;
      default:
        res.status(400).send({
          message: err.message,
          type: "UnknownValidationError",
          data: {},
        });
        break;
    }
  } else if (err instanceof NotFoundError) {
    res.status(404).send({
      message: err.message,
      type: "NotFound",
      data: {},
    });
  } else if (err instanceof UniqueViolationError) {
    res.status(409).send({
      message: err.message,
      type: "UniqueViolation",
      data: {
        columns: err.columns,
        table: err.table,
        constraint: err.constraint,
      },
    });
  } else if (err instanceof NotNullViolationError) {
    res.status(400).send({
      message: err.message,
      type: "NotNullViolation",
      data: {
        column: err.column,
        table: err.table,
      },
    });
  } else if (err instanceof ForeignKeyViolationError) {
    res.status(409).send({
      message: err.message,
      type: "ForeignKeyViolation",
      data: {
        table: err.table,
        constraint: err.constraint,
      },
    });
  } else if (err instanceof CheckViolationError) {
    res.status(400).send({
      message: err.message,
      type: "CheckViolation",
      data: {
        table: err.table,
        constraint: err.constraint,
      },
    });
  } else if (err instanceof DataError) {
    res.status(400).send({
      message: err.message,
      type: "InvalidData",
      data: {},
    });
  } else if (err instanceof DBError) {
    res.status(500).send({
      message: err.message,
      type: "UnknownDatabaseError",
      data: {},
    });
  } else {
    res.status(500).send({
      message: err.message,
      type: "UnknownError",
      data: {},
    });
  }
}

export const paramNotPresent = (
  param: string,
  res: Response,
  paramTitle: string
) => {
  if (param === "" || param === null || param === undefined) {
    res.status(400).send(`${paramTitle} is not provided by the client.`);
    return true;
  }
  return false;
};

export const createEntryRedis = (key: string, value: string) => {
  redisClient.set(key, value, (err: any, reply: any) => {
    if (err) throw err;
    console.log(reply);
  });
};

export const isString = (x: any) => {
  return Object.prototype.toString.call(x) === "[object String]";
};

export const isNumber = (n: any) => {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
};

export const isBoolean = (n: any) => {
  return n === true || n === false || toString.call(n) === "[object Boolean]";
};

export const isUUID = (uuid: any) => {
  return uuid.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
};

export const isUserAdmin = async (uuid: any) => {
  try {
    const idAdminObject: any = await db
      .select("id")
      .from("users")
      .where("id", uuid)
      .andWhere("type", "admin");

    if (idAdminObject === undefined || idAdminObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const isUser = async (uuid: any) => {
  try {
    const idUserObject: any = await db
      .select("id")
      .from("users")
      .where("id", uuid);

    if (idUserObject === undefined || idUserObject.length === 0) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};
