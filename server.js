const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const titleRoutes = require("./routes/title.js");
const descriptionRoutes = require("./routes/descriptions.js");
const genreRoutes = require("./routes/genres.js");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/description/title", titleRoutes);
app.use("/description/", descriptionRoutes);
app.use("/genre", genreRoutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
