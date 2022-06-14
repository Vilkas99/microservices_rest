import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class AppointmentModel extends Model {
  static get tableName() {
    return "appointments";
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const User = require("./User");
    const Subject = require("./Subjects");

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
      subject: {
        relation: Model.HasOneRelation,
        modelClass: Subject,
        join: {
          from: "appointments.id_subject",
          to: "subjects.id",
        },
      },
    };
  }
}

module.exports = AppointmentModel;
