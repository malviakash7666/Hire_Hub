export default (sequelize, DataTypes) => {
  const Job = sequelize.define(
    "Job",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Job title is required",
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Job description is required",
          },
        },
      },

      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      jobType: {
        type: DataTypes.ENUM(
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
        type: DataTypes.ENUM("Fresher", "Junior", "Mid", "Senior"),
        allowNull: false,
        defaultValue: "Fresher",
      },

      salaryMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      salaryMax: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      skills: {
        type: DataTypes.JSONB, // ["React", "Node", "MongoDB"]
        allowNull: true,
      },

      requirements: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      responsibilities: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("Open", "Closed", "Paused"),
        defaultValue: "Open",
      },

      source: {
        type: DataTypes.ENUM("Manual", "Bulk"),
        defaultValue: "Manual",
        allowNull: false,
      },

      batchId: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "jobs",
      timestamps: true,
    }
  );

 Job.associate = (models) => {
  Job.belongsTo(models.User, {
    foreignKey: "createdBy",
    as: "creator",
  });

  Job.hasMany(models.JobApplication, {
    foreignKey: "jobId",
    as: "applications",
  });
};
  
  

  return Job;
};