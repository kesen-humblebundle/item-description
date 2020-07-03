const express = require("express");
const routes = express();

let db;

if (process.env.NODE_ENV === "testing") {
  db = require("../tests/models/genres");
} else {
  db = require("../models/genres");
}

routes.use(express.Router());

routes.get("/:product_id", async (req, res) => {
  let { product_id } = req.params;

  if (!product_id) {
    return res.status(400).send("A valid product id is required.");
  }

  try {
    let genres = await db.getGenresByPID(product_id);

    if (genres !== undefined && genres.length > 0) {
      return res.status(200).send(genres);
    }

    return res.status(404).send("Invalid product id.");
  } catch (err) {
    console.log("Error in GET genre/:product_id \n", err);
    res.status(500).send("Unable to retrieve genres.");
  }
});

routes.get("/", (req, res) => {
  res.status(400).send("A product id is required.");
});

module.exports = routes;
