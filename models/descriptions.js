const db = require("../data/db.js");
const genreDB = require("./genres");

const getTitleByPID = async (product_id) => {
  let title = await db
    .select("title")
    .from("descriptions")
    .where({ product_id });

  return title[0];
};

const getDescriptionByPID = async (product_id) => {
  let description = await db
    .select()
    .from("descriptions")
    .where({ product_id });

  description = description[0];

  let genres = await genreDB.getGenresByPID(product_id);

  description = { ...description, genres };

  return description;
};

module.exports = {
  getTitleByPID,
  getDescriptionByPID,
};
