import { Model, RelationMappings, RelationMappingsThunk } from "objection";
const Password = require("objection-password")();
class UserModel extends Password(Model) {
  static get tableName() {
    return "users";
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const Appointment = require("./Appointment");
    const Career = require("./Career");
    const UserCareer = require("./UserCareer");
    const Schedules = require("./Schedules");

    return {
      appointmentStudent: {
        relation: Model.ManyToManyRelation,
        modelClass: Appointment,
        join: {
          from: "users.id",
          through: {
            from: "appointments-user.id_student",
            to: "appointments-user.id_appointment",
          },
          to: "appointments.id",
        },
      },
      appointmentAdmin: {
        relation: Model.ManyToManyRelation,
        modelClass: Appointment,
        join: {
          from: "users.id",
          through: {
            from: "appointments-user.id_admin",

            to: "appointments-user.id_appointment",
          },
          to: "appointments.id",
        },
      },
      appointmentAdvisor: {
        relation: Model.ManyToManyRelation,
        modelClass: Appointment,
        join: {
          from: "users.id",
          through: {
            from: "appointments-user.id_advisor",

            to: "appointments-user.id_appointment",
          },
          to: "appointments.id",
        },
      },
      userSemesters: {
        relation: Model.HasManyRelation,
        modelClass: UserCareer,
        join: {
          from: "users.id",
          to: "users-career.id_user",
        },
      },
      career: {
        relation: Model.ManyToManyRelation,
        modelClass: Career,
        join: {
          from: "users.id",
          through: {
            from: "users-career.id_user",
            to: "users-career.id_career",
          },
          to: "careers.id",
        },
      },
      schedules: {
        relation: Model.ManyToManyRelation,
        modelClass: Schedules,
        join: {
          from: "users.id",
          through: {
            from: "users-schedule.id_user",
            to: "users-schedule.id_schedule",
          },
          to: "schedules.id",
        },
      },
    };
  }
}

module.exports = UserModel;
