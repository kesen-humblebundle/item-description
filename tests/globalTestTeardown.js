const knex = require('knex');

// Almost exact same setup as globalTestSetup.js. Note that user: postgres is the default user
// for Windows WSL and Linux. It's uncertain if this knex config will work for Mac, since the default superuser
// for Mac's Postgres service isn't 'postgres', but rather the user's username.
const dropDB = async () => {
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
    await dbConnection.raw('DROP DATABASE IF EXISTS desc_service_test');
  } catch (e) {
    console.error(e);
  } finally {
    await dbConnection.destroy();
  }
}

module.exports = async () => {
  await dropDB();
}
