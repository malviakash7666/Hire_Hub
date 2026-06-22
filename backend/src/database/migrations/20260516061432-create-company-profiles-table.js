export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("company_profiles", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      primaryKey: true,
      allowNull: false,
    },

    companyName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    companyLogo: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    companyEmail: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    companyPhone: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    websiteUrl: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    industry: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    companySize: {
      type: Sequelize.ENUM(
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+"
      ),
      allowNull: true,
    },

    foundedYear: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    aboutCompany: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    country: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    pincode: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    socialLinks: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {},
    },

    isVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    createdBy: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("company_profiles");

  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_company_profiles_companySize";'
  );
}