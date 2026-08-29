require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "123456",
    port: process.env.DB_PORT || "3306",
    database: process.env.DB_NAME || "ximent",
    host: process.env.DB_HOST || "host.docker.internal",
    dialect: "mysql",
    define: {
      freezeTableName: true,
    },
    logging: false,
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "123456",
    port: process.env.DB_PORT || "3306",
    database: process.env.DB_NAME || "ximent",
    host: process.env.DB_HOST || "host.docker.internal",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "123456",
    port: process.env.DB_PORT || "3306",
    database: process.env.DB_NAME || "ximent",
    host: process.env.DB_HOST || "host.docker.internal",
    dialect: "mysql",
  },
};
