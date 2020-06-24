const express = require("express");
const routes = express();
const db = require("../models/descriptions.js");

routes.use(express.Router);

routes.get("/:product_id", async (req, res, next) => {
  let { product_id } = req.params;

  if (!product_id) {
    return res.status(400).send("A valid product ID is required.");
  }

  try {
    let title = await db.getTitleByPID(product_id);
    res.status(200).send(title);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});

module.exports = routes;
