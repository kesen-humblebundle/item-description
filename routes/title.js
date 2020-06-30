const express = require("express");
const routes = express();
//const db = require("../models/descriptions.js");
let db;

if (process.env.NODE_ENV === "testing") {
  db = require("../tests/models/descriptions");
} else {
  db = require("../models/descriptions");
}

routes.use(express.Router());

routes.get("/", (req, res) => {
  return res.status(400).send("A valid product ID is required.");
});

routes.get("/:product_id", async (req, res, next) => {
  let { product_id } = req.params;

  if (!product_id) {
    return res.status(400).send("A valid product ID is required.");
  }

  try {
    let title = await db.getTitleByPID(product_id);
    if (!title) {
      return res.status(404).send("Invalid product id.");
    }
    return res.status(200).send(title.title);
  } catch (err) {
    console.log("Failed to get title: \n", err);
    res.status(500).send({ err });
  }
});

module.exports = routes;
