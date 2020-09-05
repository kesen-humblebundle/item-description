require('dotenv').config();
const mariaDB = require('mariadb');

/**
 * Create a Postgres connection through knex via connecting to PG superuser db, then create the relevant test database from there.
 * Note that Postgres connections are destroyed after interaction has finished to avoid occupying a
 * connection pool slot. The connection is destroyed explicitly here to ensure that it does not interfere
 * with subsequent testing.
 */
const createDB = async () => {
  let conn = await mariaDB.createConnection({
    host: process.env.MDBHOST,
    user: process.env.MDBUSER,
    password: process.env.MDBPASS,
    port: process.env.MDBPORT,
    permitLocalInfile: true
  });

  try {
    await conn.query('CREATE DATABASE IF NOT EXISTS item_descriptions_test');
  } catch (e) {
    console.error(e);
  } finally {
    await conn.end();
  }
}

module.exports = async () => {
  await createDB();
  await require('../db/seedMariaDB').seed();
}
