const express = require("express");
const routes = express();
let db;

if (process.env.NODE_ENV === "testing") {
  db = require("../tests/models/descriptions");
} else {
  db = require("../models/descriptions");
}

routes.use(express.Router());

routes.get("/", (req, res) => {
  return res.status(400).send("Product id must be provided.");
});

routes.get("/:product_id", async (req, res) => {
  let { product_id } = req.params;
  // empty response to prevent tests from hanging
  if (!product_id) {
    return res.status(400).send("Product id is required.");
  }

  try {
    let description = await db.getDescriptionByPID(product_id);

    if (!description || description.length <= 0) {
      return res.status(404).send("Invalid product id");
    }

    return res.status(200).send(description);
  } catch (err) {
    console.log("Error getting description: \n", err);
    return res.status(500).send("Could not retrieve description.");
  }
});

module.exports = routes;
