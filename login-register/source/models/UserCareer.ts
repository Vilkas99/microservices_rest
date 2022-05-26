import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class UserCareerModel extends Model {
  static get tableName() {
    return "users-career";
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const User = require("./User");
    const Career = require("./Career");

    return {
      user: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: "users-career.id_career",
          to: "careers.id",
        },
      },
    };
  }
}

module.exports = UserCareerModel;
