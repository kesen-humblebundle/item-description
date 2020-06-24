require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const app = express();
const db = require("./data/db.js");

const PORT = process.env.PORT;

app.use(morgan("dev")); 
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
}); 

app.get("/api/descriptions", async (req, res) => {
  let games = await db.select().table('descriptions');
  res.status(200).json(games);
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});

module.exports = app;