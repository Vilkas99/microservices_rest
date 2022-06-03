import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class SubjectsModel extends Model {
  static get tableName() {
    return "subjects";
  }

  //TODO: Cambiar todo este método.
  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const Appointment = require("./Appointments");

    return {
      consultants: {
        relation: Model.HasManyRelation,
        modelClass: Appointment,
        join: {
          from: "subjects.id",
          to: "appointments.id",
        },
      },
    };
  }
}

module.exports = SubjectsModel;
