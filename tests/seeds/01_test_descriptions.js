exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("descriptions")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("descriptions").insert([
        {
          product_id: 1,
          title: "Cool game The Original",
          description: "A cool game",
        },
        { product_id: 2, title: "Cool game II", description: "More cool game" },
        {
          product_id: 3,
          title: "Cool game 3D",
          description: "The coolest game",
        },
        { product_id: 4, title: "Cool game 4", description: "2 cool, 2 game" },
        {
          product_id: 5,
          title: "Cool game's revenge",
          description: "Look out cool game",
        },
      ]);
    });
};
