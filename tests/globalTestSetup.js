const knex = require('knex');

/**
 * Create a Postgres connection through knex via connecting to PG superuser db, then create the relevant test database from there.
 * Note that Postgres connections are destroyed after interaction has finished to avoid occupying a
 * connection pool slot. The connection is destroyed explicitly here to ensure that it does not interfere
 * with subsequent testing.
 */
const createDB = async () => {
  const dbConnection = knex({
    client: 'postgres',
    debug: true,
    connection: {
      host: '127.0.0.1',
      database: 'postgres',
      port: '5432',
      password: '',
      user: 'postgres'
    }
  });

  try {
    await dbConnection.raw('CREATE DATABASE desc_service_test');
  } catch (e) {
    console.error(e);
  } finally {
    await dbConnection.destroy();
  }
}

module.exports = async () => {
  await createDB();
}
