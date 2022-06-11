import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class SchedulesModel extends Model {
  static get tableName() {
    return "schedules";
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const User = require("./User");
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "schedules.advisor",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = SchedulesModel;
