const db = require("../data/db.js");

const getTitleByPID = async (product_id) => {
  let title = await db
    .select("title")
    .from("descriptions")
    .where({ product_id });

  return title[0];
};

module.exports = {
  getTitleByPID,
};
