"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Notifications", "targetType", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "PUBLIC"
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Notifications", "targetType");
  }
};