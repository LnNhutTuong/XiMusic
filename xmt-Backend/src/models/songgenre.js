"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SongGenre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Song, {
        foreignKey: "songId",
        as: "song",
      });

      this.belongsTo(models.Genre, {
        foreignKey: "genreId",
        as: "genre",
      });
    }
  }
  SongGenre.init(
    {
      songId: DataTypes.INTEGER,
      genreId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "SongGenre",
    },
  );
  return SongGenre;
};
