const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, null, null, {
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  logging: true,
  pool: {
    max: 200,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: false,
    freezeTableName: true,
  },
});

module.exports = sequelize;
