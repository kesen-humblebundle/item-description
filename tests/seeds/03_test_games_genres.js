exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("games_genres")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("games_genres").insert([
        { product_id: 1, genre_id: 2 },
        { product_id: 2, genre_id: 3 },
        { product_id: 3, genre_id: 5 },
        { product_id: 3, genre_id: 6 },
        { product_id: 3, genre_id: 7 },
        { product_id: 4, genre_id: 12 },
        { product_id: 5, genre_id: 1 },
        { product_id: 5, genre_id: 10 },
      ]);
    });
};
