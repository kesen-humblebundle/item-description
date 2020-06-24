const config = require("../knexfile.js");
let env = process.env.NODE_ENV || "development";
if (process.env.TESTING === "true") env = "development";
const knex = require("knex")(config[env]);

module.exports = knex;
