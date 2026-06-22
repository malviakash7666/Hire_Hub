"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jobs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      jobType: {
        type: Sequelize.ENUM(
          "Full-Time",
          "Part-Time",
          "Internship",
          "Contract",
          "Remote"
        ),
        allowNull: false,
        defaultValue: "Full-Time",
      },

      experienceLevel: {
        type: Sequelize.ENUM(
          "Fresher",
          "Junior",
          "Mid",
          "Senior"
        ),
        allowNull: false,
        defaultValue: "Fresher",
      },

      salaryMin: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      salaryMax: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      skills: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      requirements: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      responsibilities: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      deadline: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          "Open",
          "Closed",
          "Paused"
        ),
        allowNull: false,
        defaultValue: "Open",
      },

      createdBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users", // 👈 association link
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("jobs");

    // ENUM cleanup (IMPORTANT ⚠️)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_jobs_jobType";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_jobs_experienceLevel";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_jobs_status";'
    );
  },
};