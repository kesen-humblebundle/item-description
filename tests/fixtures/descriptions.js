const genres = require('./genres');

module.exports = [
  {
    product_id: 1,
    title: "Cool game The Original",
    description: "A cool game",
    genre: genres.filter((_, idx) => idx === 1)
  },
  {
    product_id: 2,
    title: "Cool game II",
    description: "More cool game",
    genre: genres.filter((_, idx) => idx === 2)
  },
  {
    product_id: 3,
    title: "Cool game 3D",
    description: "The coolest game",
    genre: genres.filter((_, idx) => [4, 5, 6].includes(idx))
  },
  {
    product_id: 4,
    title: "Cool game 4",
    description: "2 cool, 2 game",
    genre: genres.filter((_, idx) => idx === 11)
  },
  {
    product_id: 5,
    title: "Cool game's revenge",
    description: "Look out cool game",
    genre: genres.filter((_, idx) => [0, 9].includes(idx))
  },
];
