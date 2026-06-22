"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("job_applications", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

   jobId: {
  type: Sequelize.UUID,
  allowNull: false,
  references: {
    model: "jobs",
    key: "id",
  },
  onDelete: "CASCADE",
},

applicantId: {
  type: Sequelize.UUID,
  allowNull: false,
  references: {
    model: "users",
    key: "id",
  },
  onDelete: "CASCADE",
},

    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    resumeUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    coverLetter: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    status: {
      type: Sequelize.ENUM(
        "Applied",
        "Reviewed",
        "Shortlisted",
        "Rejected",
        "Hired"
      ),
      defaultValue: "Applied",
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });

  // 🔥 Duplicate apply rokne ke liye (IMPORTANT)
  await queryInterface.addConstraint("job_applications", {
    fields: ["jobId", "applicantId"],
    type: "unique",
    name: "unique_job_application_per_user",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("job_applications");

  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_job_applications_status";'
  );
}