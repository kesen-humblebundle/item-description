const config = require("../knexfile.js");
let env = process.env.NODE_ENV || "test";
const knex = require("knex")(config[env]);

module.exports = knex;
