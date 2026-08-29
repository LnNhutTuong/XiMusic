"use strict";

const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Owner
      this.belongsTo(models.User, {
        foreignKey: "ownerId",
        as: "owner"
      });

      // những người featured trong bài hát này
      this.belongsToMany(models.User, {
        through: models.SongFeatured,
        foreignKey: "songId",
        otherKey: "featureId",
        as: "features"
      });

      // Album
      this.belongsTo(models.Album, {
        foreignKey: "albumId",
        as: "album"
      });

      // Playlist
      this.belongsToMany(models.Playlist, {
        through: models.PlaylistSong,
        foreignKey: "songId",
        otherKey: "playlistId",
        as: "playlists"
      });
      this.hasMany(models.ListeningHistory, {
        foreignKey: "songId",
        as: "listeningHistories"
      });
      // lai lai
      this.belongsToMany(models.User, {
        through: models.LikedSong,
        foreignKey: "songId",
        otherKey: "userId",
        as: "likedByUsers"
      });
      this.belongsToMany(models.Genre, {
        through: models.SongGenre,
        foreignKey: "songId",
        otherKey: "genreId",
        as: "genres"
      });
    }
  }
  Song.init({
    title: DataTypes.STRING,
    audioUrl: DataTypes.STRING,
    cover: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    plays: DataTypes.BIGINT,
    lyrics: DataTypes.TEXT,
    status: DataTypes.INTEGER,
    ownerId: DataTypes.INTEGER,
    albumId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: "Song"
  });
  return Song;
};