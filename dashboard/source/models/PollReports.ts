import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class PollReportsModel extends Model {
  static get tableName() {
    return "poll-reports";
  }

  //TODO: Cambiar todo este método.
  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const Appointments = require("./Appointments");

    return {
      appointment: {
        relation: Model.BelongsToOneRelation,
        modelClass: Appointments,
        join: {
          from: "poll-reports.id_appointment",
          to: "appointments.id",
        },
      },
    };
  }
}

module.exports = PollReportsModel;
