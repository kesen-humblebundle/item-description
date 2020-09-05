process.env.NODE_ENV = 'test';
require('dotenv').config();
const request = require('supertest');

const { app, server } = require('../server');
const descData = require("./fixtures/descriptions");
const genreList = require('./fixtures/genres');

// console.log = jest.fn(); // Suppress model & route console.logs in test command line display

describe("server integration tests", () => {
  afterAll(async () => {
    await server.close();
  });

  /***************************
   * DESCRIPTION ROUTE TESTS *
   ***************************/

  describe("GET /description/:product_id", () => {
    test("it returns a description when passed a valid product id", async () => {
      for (let i = 1; i <= descData.length; i++) {
        await request(app)
          .get(`/description/${i}`)
          .expect(200)
          .then(res => {
            expect(res.body).toMatchObject(descData[i - 1]);
          });
      }
    });

    test("returns 500 error when passed invalid product id", async () => {
      console.error = jest.fn(); // Temporarily suppress route's console.error call
      await request(app)
        .get('/description/200')
        .expect(500);
    });

    test("returns 400 when no product_id is provided", async () => {
      console.error = jest.fn(); // Temporarily suppress route's console.error call
      await request(app)
        .get('/description')
        .expect(400);
    });
  });

  describe('POST /description', () => {
    test('adds product as new record & returns 201 when passed valid title, description, and genres', async () => {
      let postBody = {
        title: 'Test game',
        description: 'This is a test game',
        genres: ['Rhythm', 'MOBA']
      };

      await request(app)
        .post('/description')
        .send(postBody)
        .set('Accept', 'application/json')
        .expect(201)
        .then(res => {
          expect(res.text).toBe('Description successfully added.');
        });

      await request(app)
        .get('/description/6')
        .expect(200)
        .then(res => {
          expect(res.body).toMatchObject({
            product_id: 6,
            title: postBody.title,
            description: postBody.description,
            genre: postBody.genres
          });
        });
    });

    test('returns 400 when passed invalid title, description, or genres', async () => {
      await request(app)
        .post('/description')
        .send({})
        .set('Accept', 'application/json')
        .expect(400);
    });
  });

  describe('UPDATE /description/:product_id', () => {
    test('updates product & returns 200 when passed valid PID param & valid title, description, genres', async () => {
      let putBody = {
        title: 'Test game revised',
        description: 'This is a new test game description',
        genres: ['Rhythm']
      };

      await request(app)
        .put('/description/6')
        .send(putBody)
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
          expect(res.text).toBe('Successfully updated product description with id 6');
        });

      await request(app)
        .get('/description/6')
        .expect(200)
        .then(res => {
          expect(res.body).toMatchObject({
            product_id: 6,
            title: putBody.title,
            description: putBody.description,
            genre: putBody.genres
          });
        });
    });

    test('updates product & returns 200 when passed valid params and partial fields in body', async () => {
      let partialPut = {
        title: 'Test game revised 2',
        genres: ['MOBA']
      };

      await request(app)
        .put('/description/6')
        .send(partialPut)
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
          expect(res.text).toBe('Successfully updated product description with id 6');
        });

      await request(app)
        .get('/description/6')
        .expect(200)
        .then(res => {
          expect(res.body).toMatchObject({
            product_id: 6,
            title: partialPut.title,
            description: 'This is a new test game description', // Unchanged description
            genre: partialPut.genres
          });
        });
    });

    test('returns 400 when not passed any valid fields in body', async () => {
      await request(app)
        .put('/description/6')
        .send({})
        .set('Accept', 'application/json')
        .expect(400);
    });
  });

  describe('DELETE /description/:product_id', () => {
    test('deletes product & genres and returns 200 when passed valid product id', async () => {
      await request(app)
        .delete('/description/6')
        .expect(200)
        .then(res => {
          expect(res.text).toBe('Successfully deleted product description with id 6');
        });

      console.error = jest.fn(); // Temporarily suppress route's console.error call
      await request(app)
        .get('/description/6')
        .expect(500);
    });

    test("returns 400 when no product_id is provided", async () => {
      await request(app)
        .delete('/description')
        .expect(400);
    });
  });

  /*********************
   * TITLE ROUTE TESTS *
   *********************/

  describe("GET /description/title/:product_id", () => {
    test("returns a title of a game when passed a valid product id", async () => {
      for (let i = 1; i <= descData.length; i++) {
        await request(app)
          .get(`/description/title/${i}`)
          .expect(200)
          .then(res => {
            expect(res.text).toBe(descData[i - 1].title);
          });
      }
    });

    test("returns 500 when passed an invalid product id", async () => {
      console.error = jest.fn(); // Temporarily suppress route's console.error call
      await request(app)
        .get('/description/title/200')
        .expect(500);
    });

    test("returns 400 if no id is sent", async () => {
      console.error = jest.fn(); // Temporarily suppress route's console.error call
      await request(app)
        .get('/description/title')
        .expect(400);
    });
  });


  /*********************
   * GENRE ROUTE TESTS *
   *********************/

  describe("GET /genre/:product_id", () => {
    test('returns the genres of a game when passed a valid product id', async () => {
      for (let i = 1; i <= descData.length; i++) {
        await request(app)
          .get(`/genre/${i}`)
          .expect(200)
          .then(res => {
            expect(res.body).toMatchObject(descData[i - 1].genre);
          });
      }
    });

    test("returns 400 if no id is sent", async () => {
      await request(app)
        .get('/genre')
        .expect(400);
    });
  });

  describe('GET /genre/genres', () => {
    test('returns a list of all valid genres', async () => {
      await request(app)
        .get('/genre/genres')
        .expect(200)
        .then(res => {
          expect(res.body).toMatchObject(genreList);
        });
    });
  });

  describe('POST /genre/:product_id', () => {
    test('adds a genre to an existing list of genres for a product & returns 201', async () => {
      await request(app)
        .post('/genre/1')
        .send({ genre: 'Platform' })
        .set('Accept', 'application/json')
        .expect(201)
        .then(res => {
          expect(res.text).toBe('Genre Platform successfully added to product id 1');
        });

      await request(app)
        .get('/genre/1')
        .expect(200)
        .then(res => {
          expect(res.body).toEqual(expect.arrayContaining(['Platform', ...descData[0].genre]));
        });
    });

    test('returns 400 and a list of valid genres if genre already exists for product', async () => {
      console.error = jest.fn(); // Temporarily suppress route's console.error call
      await request(app)
        .post('/genre/1')
        .send({ genre: 'Shooter' })
        .set('Accept', 'application/json')
        .expect(400)
        .then(res => {
          expect(res.body.error).toBe('Genre Shooter already exists for product id 1.');
          expect(res.body.validGenres).toEqual(expect.arrayContaining(genreList.filter(genre => !['Shooter', 'Platform'].includes(genre))));
        });
    });

    test('returns 400 when passed invalid product id or genre', async () => {
      await request(app)
        .post('/genre')
        .send({ genre: 'Indie' })
        .set('Accept', 'application/json')
        .expect(400)
        .then(res => {
          expect(res.text).toBe('Invalid product ID.');
        });

      await request(app)
        .post('/genre/1')
        .send({})
        .set('Accept', 'application/json')
        .expect(400)
        .then(res => {
          expect(res.text).toBe('A valid genre is required.');
        });
    });
  });

  describe('DELETE /genre/:product_id', () => {
    test('deletes an existing genre from a product & returns 200', async () => {
      await request(app)
        .delete('/genre/1')
        .send({ genre: 'Platform' })
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
          expect(res.text).toBe('Genre Platform successfully removed from product id 1');
        });

      await request(app)
        .get('/genre/1')
        .expect(200)
        .then(res => {
          expect(res.body).toMatchObject(descData[0].genre);
        });
    });

    test('returns 400 and list of valid genres if genre does not exist for product', async () => {
      console.error = jest.fn(); // Temporarily suppress route's console.error call
      await request(app)
        .delete('/genre/1')
        .send({ genre: 'Platform' })
        .set('Accept', 'application/json')
        .expect(400)
        .then(res => {
          expect(res.body).toMatchObject({
            error: 'Genre Platform doesn\'t exist for product id 1.',
            validGenres: [
              'Shooter'
            ]
          });
        });
    });

    test('returns 400 when passed invalid product id or genre', async () => {
      await request(app)
        .delete('/genre')
        .send({ genre: 'Indie' })
        .set('Accept', 'application/json')
        .expect(400)
        .then(res => {
          expect(res.text).toBe('Invalid product ID.');
        });

      await request(app)
        .delete('/genre/1')
        .send({})
        .set('Accept', 'application/json')
        .expect(400)
        .then(res => {
          expect(res.text).toBe('A valid genre is required.');
        });
    });
  });
});
