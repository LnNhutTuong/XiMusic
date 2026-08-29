"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SongFeatured extends Model {
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

      this.belongsTo(models.User, {
        foreignKey: "featureId",
        as: "feature",
      });
    }
  }
  SongFeatured.init(
    {
      songId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Songs",
          key: "id",
        },
      },

      featureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "SongFeatured",
      tableName: "SongFeatured",
      indexes: [
        {
          unique: true,
          fields: ["songId", "featureId"],
        },
      ],
    },
  );
  return SongFeatured;
};
