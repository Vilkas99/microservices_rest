import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class AppointmentModel extends Model {
  static get tableName() {
    return "appointments";
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const User = require("./User");
    const PollReports = require("./PollReports");

    return {
      student: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "appointments.id",
          through: {
            from: "appointments-user.id_appointment",
            to: "appointments-user.id_student",
          },
          to: "users.id",
        },
      },
      advisor: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "appointments.id",
          through: {
            from: "appointments-user.id_appointment",
            to: "appointments-user.id_advisor",
          },
          to: "users.id",
        },
      },
      admin: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "appointments.id",
          through: {
            from: "appointments-user.id_appointment",
            to: "appointments-user.id_admin",
          },
          to: "users.id",
        },
      },
      pollReports: {
        relation: Model.HasManyRelation,
        modelClass: PollReports,
        join: {
          from: "appointments.id",
          to: "poll-reports.id_appointment",
        },
      },
    };
  }
}

module.exports = AppointmentModel;
