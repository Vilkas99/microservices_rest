import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class CareerSubjectModel extends Model {
  static get tableName() {
    return "career-subject";
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

module.exports = CareerSubjectModel;
