import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class CareersModel extends Model {
  static get tableName() {
    return "careers";
  }
}

module.exports = CareersModel;
