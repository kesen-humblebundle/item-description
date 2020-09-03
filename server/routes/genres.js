const express = require("express");
const routes = express();
const db = require('../../db/models/genres');

routes.use(express.Router());

routes.get('/', (req, res) => {
  res.status(400).send('Valid endpoints: /genre/genres for list of valid genres, or /genre/:product_id to get genres for a specific product');
})

routes.get("/genres", async (req, res) => {
  try {
    let allGenres = await db.getAllGenres()
      .then(results => results.map(genreObj => genreObj.name));

    res.status(200).json(allGenres);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error fetching all genres');
  }
});

routes.get("/:product_id", async (req, res) => {
  const product_id = parseInt(req.params.product_id);

  if (Number.isNaN(product_id) || product_id < 1) {
    return res.status(400).send('Invalid product ID.');
  }

  try {
    let genres = await db.getGenresByPID(product_id);

    if (genres !== undefined && genres.length > 0) {
      return res.status(200).send(genres);
    }

    return res.status(404).send("Invalid product id.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Unable to retrieve genres.");
  }
});

routes.post('/', (req, res) => {
  return res.status(400).send('Invalid product ID.');
})

routes.post('/:product_id', async (req, res) => {
  const product_id = parseInt(req.params.product_id);
  const { genre } = req.body;

  if (Number.isNaN(product_id) || product_id < 1) {
    return res.status(400).send('Invalid product ID.');
  }
  if (!genre) {
    return res.status(400).send('A valid genre is required.');
  }

  try {
    await db.addGenreToProduct(product_id, genre);
    res.status(201).send(`Genre ${genre} successfully added to product id ${product_id}`);
  } catch (e) {
    console.error(e);
    res.status(e.code).json({ error: e.error.message, validGenres: e.validGenres });
  }
});

routes.delete('/', (req, res) => {
  return res.status(400).send('Invalid product ID.');
})

routes.delete('/:product_id', async (req, res) => {
  const product_id = parseInt(req.params.product_id);
  const { genre } = req.body;

  if (Number.isNaN(product_id) || product_id < 1) {
    return res.status(400).send('Invalid product ID.');
  }
  if (!genre) {
    return res.status(400).send('A valid genre is required.');
  }

  try {
    await db.removeGenreFromProduct(product_id, genre);
    res.status(200).send(`Genre ${genre} successfully removed from product id ${product_id}`);
  } catch (e) {
    console.error(e);
    res.status(e.code).json({ error: e.error.message, validGenres: e.validGenres });
  }
});

module.exports = routes;
