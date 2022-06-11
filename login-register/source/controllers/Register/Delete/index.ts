import { Request, Response, NextFunction } from "express";
import db from "../../../db/db";

const UserModel = require("../../../models/User");
const UserCareerModel = require("../../../models/UserCareer");
const SchedulesModel = require("../../../models/Schedules");
const AppointmentUserModel = require("../../../models/AppointmentUser");
const AppointmentModel = require("../../../models/Appointment");

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    console.log("ID que recibi para eliminar: ", id);
    let alreadyExists = await UserModel.query().select("type").where("id", id);
    if (alreadyExists.length !== 0) {
      if (alreadyExists[0].type === "advisor") {
        const acceptedAppointments = await AppointmentUserModel.query()
          .where("id_advisor", id)
          .withGraphFetched("advisor(onlyAccepted)")
          .modifiers({
            onlyAccepted(builder: any) {
              builder.where("status", "ACCEPTED");
            },
          });
        console.log(acceptedAppointments);
        if (acceptedAppointments.length === 0) {
          const allAdvisorAppointments = await AppointmentUserModel.query()
            .select("id_appointment")
            .where("id_advisor", id);
          allAdvisorAppointments.map(async (appointment: any) => {
            await AppointmentModel.query()
              .delete()
              .where("id", appointment.id_appointment);
          });

          await AppointmentUserModel.query().delete().where("id_advisor", id);

          await SchedulesModel.query().delete().where("advisor", id);

          await UserCareerModel.query().delete().where("id_user", id);

          await UserModel.query().deleteById(id);
          res.json({
            status: "OK",
            msg: "User deleted successfully",
          });
        } else {
          res.json({
            status: "ERROR",
            msg: "Current advisor got accepted appointments",
          });
        }
      } else {
        await UserCareerModel.query().delete().where("id_user", id);

        await UserModel.query().deleteById(id);

        res.json({
          status: "OK",
          msg: "User deleted successfully",
        });
      }
    } else {
      res.json({
        status: "ERROR",
        msg: "User does not exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
