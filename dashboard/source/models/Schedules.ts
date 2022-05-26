import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class SchedulesModel extends Model {
  static get tableName() {
    return "schedules";
  }
}

module.exports = SchedulesModel;
