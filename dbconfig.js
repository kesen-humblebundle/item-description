const mariaBaseConfig = {
  host: process.env.MDBHOST,
  user: process.env.MDBUSER,
  password: process.env.MDBPASS,
  port: process.env.MDBPORT,
  permitLocalInfile: true,
};

module.exports = {
  mariadb: {
    development: {
      ...mariaBaseConfig,
      database: process.env.DBNAME
    },
    test: {
      ...mariaBaseConfig,
      database: process.env.DBNAME + '_test'
    },
    production: {
      ...mariaBaseConfig,
      database: process.env.DBNAME
    },
  },
  couchdb: {
    development: {},
    test: {},
    production: {},
  }
}
