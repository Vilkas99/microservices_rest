import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class AppointmentUserModel extends Model {
  static get tableName() {
    return "appointments-user";
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const Appointment = require("./Appointment");
    const User = require("./User");

    return {
      appointment: {
        relation: Model.HasOneRelation,
        modelClass: Appointment,
        filter: (query) =>
          query.select(
            "id",
            "date",
            "id_subject",
            "status",
            "problem_description",
            "photo_url"
          ),
        join: {
          from: "appointments-user.id_appointment",
          to: "appointments.id",
        },
      },
      student: {
        relation: Model.HasManyRelation,
        modelClass: User,
        filter: (query) => query.select("name"),
        join: {
          from: "appointments-user.id_student",
          to: "users.id",
        },
      },
      advisor: {
        relation: Model.HasManyRelation,
        modelClass: User,
        filter: (query) => query.select("name"),
        join: {
          from: "appointments-user.id_advisor",
          to: "users.id",
        },
      },
      admin: {
        relation: Model.HasManyRelation,
        modelClass: User,
        filter: (query) => query.select("name"),
        join: {
          from: "appointments-user.id_admin",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = AppointmentUserModel;
