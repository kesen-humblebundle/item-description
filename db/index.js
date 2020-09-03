if (!process.env.DB) {
  console.error('No DB env var specified in current process.');
  process.exit(1);
}
const db = require(`./${process.env.DB}.js`);
module.exports = db;
