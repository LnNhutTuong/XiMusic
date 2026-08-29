"use strict";

const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserNotification extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId"
      });
      this.belongsTo(models.Notification, {
        foreignKey: "notificationId"
      });
    }
  }
  UserNotification.init({
    userId: DataTypes.INTEGER,
    notificationId: DataTypes.INTEGER,
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: "UserNotification"
  });
  return UserNotification;
};