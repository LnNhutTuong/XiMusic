"use strict";

const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const ListeningHistory = sequelize.define("ListeningHistory", {
    userId: DataTypes.INTEGER,
    songId: DataTypes.INTEGER,
    lastPosition: DataTypes.INTEGER,
    playedAt: DataTypes.DATE
  }, {});
  ListeningHistory.associate = function (models) {
    ListeningHistory.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user"
    });
    ListeningHistory.belongsTo(models.Song, {
      foreignKey: "songId",
      as: "song"
    });
  };
  return ListeningHistory;
};