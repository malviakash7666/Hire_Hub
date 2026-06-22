export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("users", "resetPasswordToken", {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn("users", "resetPasswordExpires", {
    type: Sequelize.DATE,
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("users", "resetPasswordToken");
  await queryInterface.removeColumn("users", "resetPasswordExpires");
}