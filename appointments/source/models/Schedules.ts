import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class SchedulesModel extends Model {
  static get tableName() {
    return "schedules";
  }

  //TODO: Cambiar todo este método.
  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const Consultant = require("./Consultant");
    const Debt = require("./Debt");

    return {
      consultants: {
        relation: Model.HasManyRelation,
        modelClass: Consultant,
        join: {
          from: "administrators.id",
          to: "consultants.id_admin",
        },
      },
      debts: {
        relation: Model.HasManyRelation,
        modelClass: Debt,
        join: {
          from: "administrators.id",
          to: "debts.id_admin",
        },
      },
    };
  }
}

module.exports = SchedulesModel;
