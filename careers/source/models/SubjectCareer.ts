import { Model, RelationMappings, RelationMappingsThunk } from "objection";

class SubjectCareerModel extends Model {
  static get tableName() {
    return "career-subject";
  }

  static get relationMappings(): RelationMappings | RelationMappingsThunk {
    const Subject = require("./Subjects");

    return {
      admin: {
        relation: Model.ManyToManyRelation,
        modelClass: Subject,
        join: {
          from: "careers.id",
          through: {
            from: "career-subject.id_career",
            to: "career-subject.id_subject",
          },
          to: "subjects.id",
        },
      },
    };
  }
}

module.exports = SubjectCareerModel;
