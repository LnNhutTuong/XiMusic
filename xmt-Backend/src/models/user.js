"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Artist Profile
      this.hasOne(models.ArtistProfile, {
        foreignKey: "userId",
        as: "artistProfile",
      });

      // Songs owner
      this.hasMany(models.Song, {
        foreignKey: "ownerId",
        as: "ownedSongs",
      });

      //nhung bai nhac ma thang nay feat
      this.belongsToMany(models.Song, {
        through: models.SongFeatured,
        foreignKey: "featureId",
        otherKey: "songId",
        as: "songs",
      });

      // Albums  artist
      this.hasMany(models.Album, {
        foreignKey: "ownerId",
        as: "albums",
      });

      // Playlist  user
      this.hasMany(models.Playlist, {
        foreignKey: "userId",
        as: "playlists",
      });

      // Like song
      this.belongsToMany(models.Song, {
        through: models.LikedSong,
        foreignKey: "userId",
        otherKey: "songId",
        as: "likedSongs",
      });

      this.hasMany(models.ListeningHistory, {
        foreignKey: "userId",
        as: "listeningHistories",
      });

      this.belongsToMany(models.Notification, {
        through: models.UserNotification,
        foreignKey: "userId",
        otherKey: "notificationId",
        as: "notifications",
      });

      this.hasMany(models.UserNotification, {
        foreignKey: "userId",
        as: "userNotifications",
      });

      this.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "group",
      });

      models.Group.hasMany(this, {
        foreignKey: "groupId",
        as: "users",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      displayName: DataTypes.STRING,
      avatar: DataTypes.STRING,
      groupId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
