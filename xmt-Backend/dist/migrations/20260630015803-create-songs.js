"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Songs", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      audioUrl: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      cover: {
        type: Sequelize.STRING(500)
      },
      duration: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      plays: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      lyrics: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      albumId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Albums",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Songs");
  }
};