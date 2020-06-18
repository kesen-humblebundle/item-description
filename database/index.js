const { Client } = require("pg");
const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

client.connect();

client.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Postgres DB connected");
  }
  client.end();
}); 
