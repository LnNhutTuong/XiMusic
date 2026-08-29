"use strict";

const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Song, {
        through: models.SongGenre,
        foreignKey: "genreId",
        otherKey: "songId",
        as: "songs"
      });
      this.hasMany(models.SongGenre, {
        foreignKey: "genreId",
        as: "songGenres"
      });
    }
  }
  Genre.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    icon: DataTypes.STRING
  }, {
    sequelize,
    modelName: "Genre"
  });
  return Genre;
};