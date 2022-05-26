import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class UserScheduleModel extends Model {
  static get tableName() {
    return "users-schedule";
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const User = require("./User");
    const Schedules = require("./Schedules");

    return {
      user: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: "users-schedule.id_schedule",
          to: "schedules.id",
        },
      },
    };
  }
}

module.exports = UserScheduleModel;
