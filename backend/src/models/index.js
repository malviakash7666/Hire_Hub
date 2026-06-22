import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath, pathToFileURL } from "url";

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// config
import configFile from "../database/config/config.cjs";

const env = (process.env.NODE_ENV || "development").trim();
const config = configFile[env];

const db = {};

const sequelizeOptions = {
  ...config,
  dialectOptions: {
    ...(config?.dialectOptions || {}),
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    // },
  },
};

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, sequelizeOptions)
  : new Sequelize(config.database, config.username, config.password, sequelizeOptions);

const files = fs.readdirSync(__dirname).filter((file) => {
  return file !== "index.js" && file.endsWith(".js");
});

for (const file of files) {
  const modelModule = await import(pathToFileURL(path.join(__dirname, file)));

  const model = modelModule.default(sequelize, DataTypes);

  db[model.name] = model;
}
// 👉 FIX END
// A client can create many assignments


// Assignment belongs to a writer


// associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;