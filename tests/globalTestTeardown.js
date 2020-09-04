require('dotenv').config();
const mariaDB = require('mariadb');

// Almost exact same setup as globalTestSetup.js. Note that user: postgres is the default user
// for Windows WSL and Linux. It's uncertain if this knex config will work for Mac, since the default superuser
// for Mac's Postgres service isn't 'postgres', but rather the user's username.
const dropDB = async () => {
  let conn = await mariaDB.createConnection({
    host: process.env.MDBHOST,
    user: process.env.MDBUSER,
    password: process.env.MDBPASS,
    port: process.env.MDBPORT,
    permitLocalInfile: true
  });

  try {
    await conn.query('DROP DATABASE IF EXISTS item_descriptions_test');
  } catch (e) {
    console.error(e);
  } finally {
    await conn.destroy();
  }
  return true;
}

module.exports = async () => {
  await dropDB();
  // Prevent mysterious hanging after 'Ran all test suites' message in CLI
  process.exit(0);
}
