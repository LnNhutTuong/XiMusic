"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LikedSong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
      });

      this.belongsTo(models.Song, {
        foreignKey: "songId",
      });
    }
  }
  LikedSong.init(
    {
      userId: DataTypes.INTEGER,
      songId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "LikedSong",
    },
  );
  return LikedSong;
};
