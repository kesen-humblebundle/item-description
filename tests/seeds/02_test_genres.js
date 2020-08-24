exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("genres")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("genres").insert([
        { name: "Action" },
        { name: "Adventure" },
        { name: "FPS" },
        { name: "Indie" },
        { name: "MMO" },
        { name: "Multiplayer" },
        { name: "Puzzle" },
        { name: "Racing" },
        { name: "Retro" },
        { name: "RPG" },
        { name: "Simulation" },
        { name: "Sports" },
        { name: "Stealth" },
        { name: "Strategy" },
        { name: "Tabletop" },
        { name: "Virtual Reality" },
      ]);
    });
};
