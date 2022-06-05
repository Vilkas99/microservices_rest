import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class AppointmentModel extends Model {
  static get tableName() {
    return "appointments";
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const Subject = require("./Subject");

    return {
      subjects: {
        relation: Model.HasOneRelation,
        modelClass: Subject,
        join: {
          from: "appointments.id",
          to: "subjects.id",
        },
      },
    };
  }
}

module.exports = AppointmentModel;
