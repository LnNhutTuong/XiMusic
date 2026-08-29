"use strict";

const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.UserNotification,
        foreignKey: "notificationId",
        otherKey: "userId",
        as: "users"
      });
      this.hasMany(models.UserNotification, {
        foreignKey: "notificationId",
        as: "userNotifications"
      });
    }
  }
  Notification.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    type: DataTypes.STRING,
    targetType: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: "Notification"
  });
  return Notification;
};