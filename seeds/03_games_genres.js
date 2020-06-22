

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("games_genres")
    .del()
    .then(function () {
      // create random genres
      // id, product_id, genre_id
      let gameGenreCombos = [];
      let id = 1;

      for (let i = 1; i <= 100; i++) {
        // Each game has a random number of genres between 1 and 3
        let numGenres = getRandomInRange(1, 3);
        let usedGenres = [];

        for (let j = 0; j < numGenres; j++) {
          // get a random genre
          let genre = getRandomInRange(1, 16);

          // if the genre was already used get another one
          while (usedGenres.includes(genre)) {
            genre = getRandomInRange(1, 16);
          }

          usedGenres.push(genre);

          gameGenreCombos.push({
            id,
            product_id: i,
            genre_id: genre,
          });

          id++;
        }
      }
      // Inserts seed entries
      return knex("games_genres").insert(gameGenreCombos);
    });
};

const getRandomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
