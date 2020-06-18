require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const app = express();
const db = require("./database/index");

const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
