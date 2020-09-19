const cluster = require('cluster');

// In master process: Spawn child processes
if (cluster.isMaster && process.env.NODE_ENV !== 'test') {
  const cpuCount = require('os').cpus().length;

  // Spawn child processes attached to same port
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  // Spawn child process on worker exit to ensure uptime
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.id} exited.`);
    cluster.fork();
  });

// Else in child process: start instance of express server on 1 CPU core
} else {
  require('dotenv').config();
  const express = require("express");
  const helmet = require("helmet");
  const cors = require("cors");
  const path = require("path");

  const titleRoutes = require("./routes/title.js");
  const descriptionRoutes = require("./routes/descriptions.js");
  const genreRoutes = require("./routes/genres.js");

  const app = express();

  if (process.env.NODE_ENV !== 'test') {
    app.use(helmet());
    app.use(cors());

    // Set client-side shared cache with maximum TTL
    app.use((req, res, next) => {
      res.set('Cache-Control', 'public, max-age=31536000');
      next();
    });
  }

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use("/description/title", titleRoutes);
  app.use("/description/", descriptionRoutes);
  app.use("/genre", genreRoutes);

  app.get("/bundle", (req, res) => {
    res
      .type("application/javascript")
      .sendFile(path.join(__dirname, '..', 'public', 'bundle.js'));
  });

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

  const server = app.listen(process.env.PORT || 3003, () => {
    // Suppress console.log during testing to reduce testing command line display clutter
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Listening on port ${process.env.PORT || 3003}. Worker ID: ${cluster.worker.id}`);
    }
  });

  module.exports = { app, server };
}

