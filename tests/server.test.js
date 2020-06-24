const { TestScheduler } = require("jest");
const app = require("../index.js");
const db = require("../models/descriptions.js");

const request = require("supertest");

beforeAll(() => {
  process.env = Object.assign(process.env, { NODE_ENV: "development" });
});

describe("sanity check", () => {
  test("returns some content", async () => {
    await request(app).get("/").expect(200);
  });
});

describe("title endpoint", () => {
  test("returns a title of a game when passed a valid product id", async () => {
    await request(app)
      .get("/title/1")
      .expect(200)
      .expect("Content-Type", /text/);
  });

  test("returns an appropriate error when passed an invalid product id", async () => {
    await request(app).get("/title/100").expect(404);
  });

  test("returns an appropriate error if no id is sent", async () => {
    await request(app).get("/title").expect(400).expect("Content-Type", /text/);
  });
});
