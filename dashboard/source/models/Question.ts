import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class QuestionModel extends Model {
  static get tableName() {
    return "questions";
  }
}

module.exports = QuestionModel;
