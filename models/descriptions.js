const db = require("../data/db.js");

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

  return description[0];
};

module.exports = {
  getTitleByPID,
  getDescriptionByPID,
};
