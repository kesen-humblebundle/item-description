const faker = require("faker");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("descriptions")
    .del()
    .then(function () {
      // Inserts seed entries
      // generate 100 random games
      let games = [];

      for (let i = 1; i <= 100; i++) {
        let title = faker.fake("{{lorem.word}} {{lorem.word}} {{lorem.words}}");
        title = title
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        let description = faker.fake("{{lorem.paragraphs}}");

        games.push({
          product_id: i,
          title,
          description,
        });
      }
      return knex("descriptions").insert(games);
    });
};
