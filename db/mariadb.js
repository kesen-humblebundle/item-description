require('dotenv').config();
const mariadb = require('mariadb');
let config = require('../dbconfig').mariadb[process.env.NODE_ENV];
const pool = mariadb.createPool(config);

module.exports = {
  getConnection: () => {
    return new Promise((resolve, reject) => {
      pool.getConnection()
        .then(connection => {
          resolve(connection);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
