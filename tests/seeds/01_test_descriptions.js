exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("descriptions")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("descriptions").insert([
        {
          title: "Cool game The Original",
          description: "A cool game",
        },
        {
          title: "Cool game II",
          description: "More cool game"
        },
        {
          title: "Cool game 3D",
          description: "The coolest game",
        },
        {
          title: "Cool game 4",
          description: "2 cool, 2 game"
        },
        {
          title: "Cool game's revenge",
          description: "Look out cool game",
        },
      ]);
    });
};
