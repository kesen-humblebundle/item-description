exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("genres")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("genres").insert([
        { id: 1, name: "Action" },
        { id: 2, name: "Adventure" },
        { id: 3, name: "FPS" },
        { id: 4, name: "Indie" },
        { id: 5, name: "MMO" },
        { id: 6, name: "Multiplayer" },
        { id: 7, name: "Puzzle" },
        { id: 8, name: "Racing" },
        { id: 9, name: "Retro" },
        { id: 10, name: "RPG" },
        { id: 11, name: "Simulation" },
        { id: 12, name: "Sports" },
        { id: 13, name: "Stealth" },
        { id: 14, name: "Strategy" },
        { id: 15, name: "Tabletop" },
        { id: 16, name: "Virtual Reality" },
      ]);
    });
};
