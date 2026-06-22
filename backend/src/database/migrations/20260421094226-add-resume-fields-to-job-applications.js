export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("job_applications", "resumePublicId", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("job_applications", "resumeOriginalName", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("job_applications", "resumeResourceType", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("job_applications", "resumeFormat", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("job_applications", "resumeBytes", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("job_applications", "resumeBytes");
    await queryInterface.removeColumn("job_applications", "resumeFormat");
    await queryInterface.removeColumn("job_applications", "resumeResourceType");
    await queryInterface.removeColumn("job_applications", "resumeOriginalName");
    await queryInterface.removeColumn("job_applications", "resumePublicId");
  },
};