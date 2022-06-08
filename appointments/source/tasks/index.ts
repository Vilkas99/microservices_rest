import db from "../db/db";

export const markAppointmentsAsCompleted = async () => {
  try {
    const result = await db("appointments")
      .where("status", "ACCEPTED")
      .andWhere("date", "<", new Date(Date.now()))
      .update({ status: "COMPLETED" });
    return result;
  } catch (error) {
    return error;
  }
};
