"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("jobs", "source", {
      type: Sequelize.ENUM("Manual", "Bulk"),
      defaultValue: "Manual",
      allowNull: false,
    });
    await queryInterface.addColumn("jobs", "batchId", {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("jobs", "source");
    await queryInterface.removeColumn("jobs", "batchId");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_jobs_source";');
  },
};
