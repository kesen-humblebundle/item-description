// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    //connection: process.env.PGURL,
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
  },

  // production: {
  //   client: "pg",
  //   connection: {
  //     host: process.env.PGHOST,
  //     user: process.env.PGUSER,
  //     password: process.env.PGPASSWORD,
  //     database: process.env.PGDATABASE,
  //     port: process.env.PGPORT,
  //   },
  //   migrations: {
  //     tableName: "knex_migrations",
  //   },
  // },
};
