require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
  test: {
    client: "pg",
    connection: {
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: 'desc_service_test',
      port: process.env.PGPORT,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./tests/seeds",
    },
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
