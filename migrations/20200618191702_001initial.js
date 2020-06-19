exports.up = async (knex) => {
  await knex.schema.createTable("descriptions", (table) => {
    table.integer("product_id").notNullable().primary();
    table.string("title").notNullable();
    table.string("description").notNullable();
  });

  await knex.schema.createTable("genres", (table) => {
    table.increments("id").primary();
    table.string("genre_name").notNullable();
  });

  await knex.schema.createTable("games_genres", (table) => {
    table.increments("id").primary();
    table
      .integer("product_id")
      .references("product_id")
      .inTable("descriptions")
      .notNullable();
    table.integer("genre_id").references("id").inTable("genres").notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("games_genres");
  await knex.schema.dropTableIfExists("genres");
  await knex.schema.dropTableIfExists("descriptions");
};
