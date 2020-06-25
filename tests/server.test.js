const { TestScheduler } = require("jest");
const app = require("../server.js");
const knex = require("../data/db");

const request = require("supertest");

beforeAll(async () => {
  console.log("Seeding the test db");
  const config = require("../knexfile.js")["test"];
  await knex.migrate.down(config);
  await knex.migrate.latest(config);
  await knex.seed.run(config);
});

afterAll(async (done) => {
  const config = require("../knexfile.js")["development"];
  console.log("Resetting db. Tests  complete.");
  await knex.migrate.down(config);
  await knex.migrate.latest(config);
  await knex.seed.run(config);
  done(); // avoid jest open handle error
});

describe("sanity check", () => {
  test("returns some content", async () => {
    await request(app).get("/").expect(200);
  });
});

describe("title endpoint", () => {
  test("returns a title of a game when passed a valid product id", async (done) => {
    const response = await request(app).get("/description/title/1").expect(200);

    done();
  });

  test("returns an appropriate error when passed an invalid product id", async () => {
    await request(app).get("/description/title/100").expect(404);
  });

  test("returns an appropriate error if no id is sent", async () => {
    await request(app)
      .get("/description/title")
      .expect(400)
      .expect("Content-Type", /text/);
  });
});
