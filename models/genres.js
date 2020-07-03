const db = require("../data/db");

const getGenresByPID = async (product_id) => {
  let genres = await db("genres")
    .join("games_genres", "genres.id", "=", "games_genres.genre_id")
    .where("games_genres.product_id", "=", product_id)
    .select("genres.name");

  genres = genres.map((genre) => genre.name);

  return genres;
};

module.exports = {
  getGenresByPID,
};
