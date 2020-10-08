const express = require("express");
const routes = express();
const db = require('../../db/models/mariaDB_descriptions');
const { fetchFromCache, setCache, invalidateCache } = require('../redisMethods');

routes.use(express.Router());

routes.get("/", (req, res) => {
  return res.status(400).send("Product id must be provided.");
});


routes.get("/:product_id", fetchFromCache, async (req, res) => {
  const product_id = parseInt(req.params.product_id);

  if (Number.isNaN(product_id) || product_id < 1) {
    return res.status(400).send('Invalid product ID.');
  }

  try {
    let description = await db.getDescriptionByPID(product_id);

    if (!description || description.length <= 0) {
      return res.status(404).send("Invalid product ID.");
    }

    // If no 400 or 500 errors, store key-val pair in server cache
    setCache(req.originalUrl, JSON.stringify(description));
    return res.status(200).send(description);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Could not retrieve description.");
  }
});


routes.post('/', async (req, res) => {
  const { title, description, genres } = req.body;

  if (!title || !description || !genres) {
    return res.status(400).send('Title, description, and genres fields are required.');
  }

  if (!genres.length || new Set(genres).size !== genres.length) {
    return res.status(400).send('Genres must be a unique list. Visit /genre/genres for a list of valid genres.');
  }

  try {
    await db.addDescription(title, description, genres);
    res.status(201).send('Description successfully added.');
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

routes.delete('/', (req, res) => {
  return res.status(400).send('Invalid product ID.');
})

routes.delete('/:product_id', async (req, res) => {
  const product_id = parseInt(req.params.product_id);

  if (Number.isNaN(product_id) || product_id < 1) {
    return res.status(400).send('Invalid product ID.');
  }

  try {
    await db.deleteDescriptionByPID(product_id);
    // After successful deletion, invalidate key-val pair for descriptions AND genre/title caches, if exists
    invalidateCache(req.originalUrl);
    invalidateCache(`/genre/${product_id}`);
    invalidateCache(`/description/title/${product_id}`);
    res.status(200).send(`Successfully deleted product description with id ${product_id}`);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

routes.put('/:product_id', async (req, res) => {
  const product_id = parseInt(req.params.product_id);
  const { title, description, genres } = req.body;

  if (Number.isNaN(product_id) || product_id < 1) {
    return res.status(400).send('Invalid product ID.');
  }
  if (!title && !description && !genres) {
    return res.status(400).send('Please provide at least one of title, description, or genres fields for update.');
  }
  if (genres && genres.length && new Set(genres).size !== genres.length) {
    return res.status(400).send('Genres must be a unique list. Visit /genre/genres for a list of valid genres.');
  }

  try {
    await db.updateDescriptionForPID(product_id, title, description, genres);
    // After successful update, invalidate key-val pair for description AND genre/title, if exists
    invalidateCache(req.originalUrl);
    invalidateCache(`/genre/${product_id}`);
    invalidateCache(`/description/title/${product_id}`);
    res.status(200).send(`Successfully updated product description with id ${product_id}`);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

module.exports = routes;
