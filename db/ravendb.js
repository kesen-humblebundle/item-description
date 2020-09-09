require('dotenv').config();
const { DocumentStore } = require('ravendb');
const config = require('../dbconfig').ravendb[process.env.NODE_ENV];

// Create DocumentStore instance & initialize
const store = new DocumentStore(`http://localhost:${process.env.RDBPORT}`, config.database);
store.initialize();

module.exports = store;
