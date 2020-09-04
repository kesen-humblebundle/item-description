const db = require('../mariadb');

/*************
 * GET query *
 *************/
/**
 * Get a list of genres for a product id
 * @param {Number} product_id
 * @returns {Array[String]}
 */
const getGenresByPID = async (product_id) => {
  let conn = await db.getConnection();
  let genres = await conn.query(`
    SELECT genres.name
    FROM genres JOIN games_genres
    ON genres.id = games_genres.genre_id
    WHERE games_genres.product_id=${product_id}
  `);
  genres = genres.map(genre => genre.name);
  await conn.end();
  return genres;
}

exports.getGenresByPID = getGenresByPID;

/**
 * Get all valid genres
 * @returns {Promise->Array}
 */
const getAllGenres = async () => {
  let conn = await db.getConnection();
  let rows = await conn.query('SELECT * FROM genres');
  await conn.end();
  return rows;
}

exports.getAllGenres = getAllGenres;


/*********
 * Utils *
 *********/
/**
 * Check if genre is valid, and if it exists already in product description
 * @param {Number} product_id
 * @param {String} genre_id
 * @param {Boolean} errOnExists: if true, throw err if genre exists in product desc, else throw err if doesn't exist
 * @param {Boolean} suppressExistsCheck: if true, ignore whether genre exists in product desc
 * @returns {Number} if no errors are thrown, returns genre_id
 */
const validateGenreForPID = async (product_id, genre, errOnExists, suppressExistsCheck = false) => {
  // Check if genre is a valid genre
  let allGenres = await getAllGenres();
  let genreList = allGenres.map(genre => genre.name);

  if (!genreList.includes(genre)) {
    throw {
      error: new Error(`${genre} is not a valid genre. Please choose from the list of valid genres.`),
      code: 400,
      validGenres: genreList
    }
  }

  // Check if genre already exists in product description, if suppressExistsCheck flag is false
  let genreId = allGenres
    .filter(genreObj => genreObj.name === genre)
    .map(genreObj => genreObj.id)[0];

  if (!suppressExistsCheck) {
    let conn = await db.getConnection();
    let existingGenres = await conn.query(`
      SELECT genre_id FROM games_genres
      WHERE product_id=${product_id}
    `)
    .then(genreIds => genreIds.map(idObj => allGenres[idObj.genre_id-1].name));
    await conn.end();

    let errMessage = `Genre ${genre} ${errOnExists ? 'already exists' : 'doesn\'t exist'} for product id ${product_id}.`;

    if (
      existingGenres &&
      (
        (errOnExists && existingGenres.includes(genre)) ||
        (!errOnExists && !existingGenres.includes(genre))
      )
    ) {
      throw {
        error: new Error(errMessage),
        code: 400,
        validGenres: errOnExists ? genreList.filter(genre => !existingGenres.includes(genre)) : existingGenres
      }
    }
  }

  return genreId;
}


/**************
 * POST query *
 **************/
/**
 * Add a genre to a product id, doing nothing if genre is invalid
 * @param {Number} product_id
 * @param {String} genre: genre to add
 * @returns {Promise->Boolean}: true if insert query was successful
 */
exports.addGenreToProduct = async (product_id, genre) => {
  let genreId = await validateGenreForPID(product_id, genre, true);
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(`
      INSERT INTO games_genres (product_id, genre_id)
      VALUES (${product_id}, ${genreId})
    `);
  } catch (e) {
    // If the thrown object contains an error key, it was throw from validateGenreForPID & should not be modified
    if (e.error) {
      throw (e);
    } else {
      throw { error: e, code: 500 };
    }
  } finally {
    await conn.end();
  }
  return true;
}


/******************
 * DELETE queries *
 ******************/
/**
 * Remove a genre from a product id, doing nothing if genre is invalid or if product only has one genre
 * @param {Number} product_id
 * @param {String} genre: genre to remove
 * @returns {Promise->Boolean}: true if delete query was successful
 */
exports.removeGenreFromProduct = async (product_id, genre) => {
  let genreId = await validateGenreForPID(product_id, genre, false);
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(`
      DELETE FROM games_genres
      WHERE product_id=${product_id} AND genre_id=${genreId}
    `);
  } catch (e) {
    // If the thrown object contains an error key, it was throw from validateGenreForPID & should not be modified
    if (e.error) {
      throw (e);
    } else {
      throw { error: e, code: 500 };
    }
  } finally {
    await conn.end();
  }
  return true;
}

/**
 * Remove all genres with input product_id. Used internally (not attached to a server route) for deleting an entire product description.
 * @param {Number} product_id
 * @param {Function} conn: a mariadb connection instance
 * @returns {Promise->Boolean}: true if delete query was successful
 */
exports.removeAllGenresForPID = async (product_id, conn) => {
  return await conn.query(`
    DELETE FROM games_genres
    WHERE product_id=${product_id}
  `);
}

