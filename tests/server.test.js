const { createInstance } = require("axios-test-instance");
const descData = require("./models/data/descriptions");
const app = require("../server.js");
let instance;

describe("server unit tests", () => {
  beforeAll(async () => {
    console.log("Starting up unit tests.");
    instance = await createInstance(app);
  });

  afterAll(async () => {
    await instance.close();
  });

  describe("GET /description/:product_id", () => {
    test("it returns a description when passed a valid product id", async () => {
      const { data, status } = await instance.get("/description/1");

      expect(data).toMatchObject(descData[0]);
      expect(status).toBe(200);
    });

    test("returns 404 error when passed invalid product id", async () => {
      const { status } = await instance.get("/description/200");

      expect(status).toBe(404);
    });

    test("returns 400 when no product_id is provided", async () => {
      const { status } = await instance.get("/description");

      expect(status).toBe(400);
    });
  });

  describe("GET /description/title/:product_id", () => {
    test("returns a title of a game when passed a valid product id", async () => {
      const { data, status } = await instance.get("/description/title/1");
      console.log("Title from get: ", data);
      expect(data).toBe(descData[0]["title"]);
      expect(status).toBe(200);
    });

    test("returns 404 when passed an invalid product id", async () => {
      const { data, status } = await instance.get("/description/title/200");

      expect(status).toBe(404);
    });

    test("returns 400 if no id is sent", async () => {
      const { status } = await instance.get("/description/title");

      expect(status).toBe(400);
    });
  });
});

xdescribe("server integration testing", () => {
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
});
