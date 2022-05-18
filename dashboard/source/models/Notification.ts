import { Model } from "objection";

class NotificationModel extends Model {
  static get tableName() {
    return "notifications";
  }
}

module.exports = NotificationModel;
