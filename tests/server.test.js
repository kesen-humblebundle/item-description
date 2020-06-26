const { createInstance } = require("axios-test-instance");
const app = require("../server.js");
let instance;

beforeAll(async () => {
  const knex = require("../data/db");
  instance = await createInstance(app);
  await knex.migrate.down();
  await knex.migrate.latest();
  await knex.seed.run();
});

afterAll(async () => {
  const knex = require("../data/db.js");
  await knex.migrate.down();
  await knex.migrate.latest();
  await knex.seed.run({
    directory: "./seeds",
  });
  await knex.destroy();
  await instance.close();
});

describe("sanity check", () => {
  test("returns some content", async () => {
    const { status } = await instance.get("/");

    expect(status).toBe(200);
  });
});

describe("title endpoint", () => {
  test("returns a title of a game when passed a valid product id", async () => {
    const { data, status } = await instance.get("/description/title/1");
    console.log(data);

    expect(status).toBe(200);
  });

  test("returns an appropriate error when passed an invalid product id", async () => {
    const { data, status } = await instance.get("/description/title/200");

    expect(status).toBe(404);
  });

  test("returns an appropriate error if no id is sent", async () => {
    const { status } = await instance.get("/description/title");

    expect(status).toBe(400);
  });
});
