export default (sequelize, DataTypes) => {
  const CompanyProfile = sequelize.define(
    "CompanyProfile",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Company name is required",
          },
        },
      },

      companyLogo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      companyEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Please enter a valid company email",
          },
          notEmpty: {
            msg: "Company email is required",
          },
        },
      },

      companyPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      websiteUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      industry: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      companySize: {
        type: DataTypes.ENUM(
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
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      aboutCompany: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      pincode: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      socialLinks: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
      },

      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "company_profiles",
      timestamps: true,
    }
  );

  CompanyProfile.associate = (models) => {
    CompanyProfile.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    });
  };

  return CompanyProfile;
};