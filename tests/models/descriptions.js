const data = require("./data/descriptions");

const getTitleByPID = (product_id) => {
  let title = undefined;

  data.forEach((game) => {
    if (Number(game.product_id) == Number(product_id)) {
      title = game.title;
    }
  });

  return title;
};

const getDescriptionByPID = (product_id) => {
  let description = data.filter(
    (game) => Number(product_id) === Number(game.product_id)
  );

  if (description !== undefined && description.length > 0)
    description = description[0];

  return description;
};

module.exports = {
  getTitleByPID,
  getDescriptionByPID,
};
