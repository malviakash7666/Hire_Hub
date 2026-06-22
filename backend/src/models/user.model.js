import bcrypt from "bcryptjs";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name is required",
          },
        },
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already exists",
        },
        validate: {
          isEmail: {
            msg: "Invalid email format",
          },
          notEmpty: {
            msg: "Email is required",
          },
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 100],
            msg: "Password must be at least 6 characters",
          },
        },
      },

      role: {
        type: DataTypes.ENUM("job_poster", "job_seeker", "admin"),
        allowNull: false,
        defaultValue: "job_seeker",
        validate: {
          isIn: {
            args: [["job_poster", "job_seeker", "admin"]],
            msg: "Role must be job_poster, job_seeker, or admin",
          },
        },
      },
      resetPasswordToken: {
  type: DataTypes.STRING,
  allowNull: true,
},

resetPasswordExpires: {
  type: DataTypes.DATE,
  allowNull: true,
},
    },
    {
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

User.associate = (models) => {
  User.hasMany(models.Job, {
    foreignKey: "createdBy",
    as: "jobs",
  });

  User.hasMany(models.JobApplication, {
    foreignKey: "applicantId",
    as: "applications",
  });
};
 

  return User;
};