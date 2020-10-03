const mariaBaseConfig = {
  host: process.env.MDBHOST,
  user: process.env.MDBUSER,
  password: process.env.MDBPASS,
  port: process.env.MDBPORT,
  database: process.env.DBNAME,
  permitLocalInfile: true,
};

module.exports = {
  mariadb: {
    development: mariaBaseConfig,
    test: {
      ...mariaBaseConfig,
      user: process.env.CI ? 'root' : process.env.MDBUSER,
      password: process.env.CI ? 'ci_password' : process.env.MDBPASS,
      database: process.env.DBNAME + '_test'
    },
    production: {
      ...mariaBaseConfig,
      host: process.env.DB_IP
    },
  },
  ravendb: {
    development: { database: process.env.DBNAME },
    production: { database: process.env.DBNAME },
    test: { database: process.env.DBNAME + '_test' }
  }
}
