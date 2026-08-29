"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ArtistProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  ArtistProfile.init(
    {
      userId: DataTypes.INTEGER,
      stageName: DataTypes.STRING,
      bio: DataTypes.TEXT,
      verified: DataTypes.INTEGER,
      monthlyListeners: DataTypes.INTEGER,
      country: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ArtistProfile",
    },
  );
  return ArtistProfile;
};
