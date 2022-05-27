import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class PollReportsModel extends Model {
  static get tableName() {
    return "poll-reports";
  }
}

module.exports = PollReportsModel;
