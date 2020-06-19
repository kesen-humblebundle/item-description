exports.up = function (knex) {
  knex.schema.createTable("descriptions", (table) => {
    table.integer("product_id").notNullable().primary();
    table.string("title").notNullable();
    table.string("description").notNullable();
  });

  knex.schema.createTable("genres", (table) => {
    table.increments().primary();
    table.string("genre_name").notNullable();
  });

  knex.schema.createTable("games_genres", (table) => {
    table.increments().primary();
    table
      .integer("product_id")
      .references("product_id")
      .inTable("descriptions")
      .notNullable();
    table.integer("genre_id").references("id").inTable("genres").notNullable();
  });
};

exports.down = function (knex) {
  knex.schema.dropTableIfExists("games_genres");
  knex.schema.dropTableIfExists("genres");
  knex.schema.dropTableIfExists("descriptions");
};
