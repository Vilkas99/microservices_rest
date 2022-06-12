import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

enum EVerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
}

enum EUserStatus {
  DELETED = "DELETED",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const updateVerification = async (req: Request, res: Response) => {
  try {
    const { token, cancel } = req.body;

    if (token != undefined && cancel != undefined) {
      const success = await db("emailVerifications")
        .where("token", token.toString())
        .andWhere({ status: EVerificationStatus.PENDING })
        .select("id", "id_user");
      console.log("se pidió cancelar?", cancel);
      if (success && success.length === 1) {
        if (cancel) {
          // TODO: descomentar estas dos líneas cuando todos los on cascade realacionados a users queden implementados
          await db("emailVerifications")
            .where("id_user", success[0].id_user)
            .delete();
          await db("users-career")
            .where("id_user", success[0].id_user)
            .delete();
          await db("users").where("id", success[0].id_user).delete();
          res.status(200).send("Registration cancelled successfully");
        } else {
          await db("users")
            .where("id", success[0].id_user)
            .update({ status: EUserStatus.ACTIVE });
          await db("emailVerifications")
            .where("id", success[0].id)
            .update({ status: EVerificationStatus.VERIFIED });
          res.status(200).send("Email verified successfully");
        }
      } else {
        res.status(404).send("Error. Invalid token");
      }
    } else {
      res.status(400).send("Error. Incomplete request.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal error");
  }
};
