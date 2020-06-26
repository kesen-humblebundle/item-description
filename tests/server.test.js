const { TestScheduler } = require("jest");
const app = require("../server.js");

const request = require("supertest");

beforeAll(async (done) => {
  const knex = require("../data/db");
  await knex.migrate.down();
  await knex.migrate.latest();
  await knex.seed.run();
  done();
});

afterAll(async (done) => {
  process.env.NODE_ENV = "development";
  const knex = require("../data/db.js");
  await knex.migrate.down();
  await knex.migrate.latest();
  await knex.seed.run({
    directory: "./seeds",
  });
  console.log("Post-test scripts ran");
  done();
});

describe("sanity check", () => {
  test("returns some content", async (done) => {
    await request(app).get("/").expect(200);
    done();
  });
});

describe("title endpoint", () => {
  test("returns a title of a game when passed a valid product id", async (done) => {
    const response = await request(app).get("/description/title/1").expect(200);
    done();
  });

  test("returns an appropriate error when passed an invalid product id", async (done) => {
    await request(app).get("/description/title/100").expect(404);
    done();
  });

  test("returns an appropriate error if no id is sent", async (done) => {
    await request(app).get("/description/title").expect(400);
    done();
  });
});
