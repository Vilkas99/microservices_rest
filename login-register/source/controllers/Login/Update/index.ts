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
    const { token } = req.body;

    if (token != undefined) {
      const success = await db("emailVerifications")
        .where("token", token.toString())
        .andWhere({ status: EVerificationStatus.PENDING })
        .select("id", "id_user");
      if (success && success.length === 1) {
        await db("users")
          .where("id", success[0].id_user)
          .update({ status: EUserStatus.ACTIVE });
        await db("emailVerifications")
          .where("id", success[0].id)
          .update({ status: EVerificationStatus.VERIFIED });
        res.status(200).send("Email verified successfully");
      } else {
        res.status(400).send("Error. Invalid token");
      }
    } else {
      res.status(400).send("Error. No token provided");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal error");
  }
};
