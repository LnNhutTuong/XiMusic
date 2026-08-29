"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "owner",
      });

      this.belongsToMany(models.Song, {
        through: models.PlaylistSong,
        foreignKey: "playlistId",
        otherKey: "songId",
        as: "songs",
      });
    }
  }
  Playlist.init(
    {
      name: DataTypes.STRING,
      cover: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      isPublic: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Playlist",
    },
  );
  return Playlist;
};
