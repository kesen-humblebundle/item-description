const express = require("express");
const routes = express();
let db;
if (process.env.DB === 'mariadb') {
  db = require('../../db/models/mariaDB_descriptions');
} else if (process.env.DB === 'couchdb') {
  db = require(/* TODO */);
} else {
  throw new Error('DB env var not specified');
}

routes.use(express.Router());

routes.get("/", async (req, res) => {
  let { id } = req.query;
  if (!id || id.length <= 0) {
    return res.status(400).send("A valid product ID is required.");
  }

  // Query may be one or more ids, thus converting all possible inputs to array for getTitleByPID
  let titles = await db.getTitleByPID(Array.isArray(id) ? id : [id]);

  res.status(200).send(titles);
});

routes.get("/:product_id", async (req, res) => {
  const product_id = parseInt(req.params.product_id);

  if (Number.isNaN(product_id) || product_id < 1) {
    return res.status(400).send('Invalid product ID.');
  }

  try {

    let title = await db.getTitleByPID([product_id]);
    if (!title.length || !title[0].title) {
      return res.status(404).send("Invalid product id.");
    }
    return res.status(200).send(title[0].title);
  } catch (err) {
    console.error(err);
    res.status(500).send({ err });
  }
});

module.exports = routes;
