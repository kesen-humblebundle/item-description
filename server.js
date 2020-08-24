require('dotenv').config();
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
app.use(helmet.noSniff());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/description/title", titleRoutes);
app.use("/description/", descriptionRoutes);
app.use("/genre", genreRoutes);

app.get("/bundle", (req, res) => {
  res
    .type("application/javascript")
    .sendFile(path.join(__dirname, "public", "bundle.js"));
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = app.listen(process.env.PORT || 3003, () => {
  // Suppress console.log during testing to reduce testing command line display clutter
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Listening on port ${process.env.PORT || 3003}`);
  }

});

module.exports = { app, server };
