require('dotenv').config();
const mariadb = require('mariadb');
const pool = mariadb.createPool(
  require('../dbconfig').mariadb[process.env.NODE_ENV]
);

module.exports = {
  getConnection: () => {
    return new Promise((resolve, reject) => {
      pool.getConnection()
        .then(connection => {
          console.log('Connected to MariaDB pool');
          resolve(connection);
        })
        .catch(err => {
          console.error('Error connecting to MariaDB pool');
          reject(err);
        });
    });
  }
}
