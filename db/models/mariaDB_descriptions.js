const db = require('../mariadb');
const { getGenresByPID, removeAllGenresForPID } = require('./mariaDB_genres');

/*****************
 * TITLE QUERIES *
 *****************/
/**
 * Get the title of a product. Function may be used for /description/title/:product_id endpoint
 * OR /description/title?id=5&id=7 query endpoint, depending on the input.
 * @param {Array} product_id: array of 1 or more numbers
 * @returns {Array[Object]}: title(s) and product_id(s) of product(s)
 */
exports.getTitleByPID = async (product_id) => {
  if (!Array.isArray(product_id)) {
    throw new Error('Parameter must be an array of one or more product ids.');
  }

  let conn = await db.getConnection();
  let titleArr = await conn.query(`
    SELECT product_id, title
    FROM descriptions
    WHERE product_id IN (${product_id.join(',')})
  `);

  if (!titleArr.length) {
    throw new Error(`No titles found matching product id ${product_id}.`);
  }

  await conn.end();
  return titleArr;
}


/*********
 * UTILS *
 *********/

/**
 * Add genres to a product through passed in database transaction
 * @param {Number} product_id
 * @param {String} genre
 * @param {Function} conn: mariadb connection instance
 * @returns {Promise}
 */
const addGenreForPIDAsTransaction = async (product_id, genre, conn) => {
  let genreId = await conn.query(`
    SELECT id FROM genres
    WHERE name='${genre}'
  `);

  if (!genreId) {
    throw new Error(`Invalid genre ${genre}. Please visit /genre/genres for a list of valid genres.`);
  }

  return await conn.query(`
    INSERT INTO games_genres (product_id, genre_id)
    VALUES (${product_id}, ${genreId[0].id})
  `);
}


/***********************
 * DESCRIPTION QUERIES *
 ***********************/
/**
 * Get an existing product
 * @param {Number} product_id
 * @returns {Object} description: description obj containing product_id, title, description, genre keys as per schema specs
 */
exports.getDescriptionByPID = async (product_id) => {
  let conn = await db.getConnection();
  let descriptionArr = await conn.query(`
    SELECT * FROM descriptions
    WHERE product_id=${product_id}
  `);
  await conn.end();
  let genre = await getGenresByPID(product_id);

  if (!descriptionArr.length) {
    throw new Error(`No description found matching product id ${product_id}.`);
  }

  if (!genre.length) {
    throw new Error(`No genres found matching product id ${product_id}.`);
  }

  return { ...descriptionArr[0], genre };
}

 /**
  * Add a new product
  * @param {String} title
  * @param {String} description
  * @param {Array} genres (note that invalid genres in the array will result in entire record not being added)
  * @returns {Promise->Boolean}: true if insert transaction successful
  */
exports.addDescription = async (title, description, genres) => {
  let conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    let insertedProductId = await conn.query(`
      INSERT INTO descriptions (title, description)
      VALUES ('${title}', '${description}')
      RETURNING (SELECT LAST_INSERT_ID())
    `);

    for (let i = 0; i < genres.length; i++) {
      await addGenreForPIDAsTransaction(insertedProductId[0].product_id, genres[i], conn);
    }

    await conn.commit();
  } catch (e) {
    await conn.rollback();
    console.error(e);
    throw (e);
  } finally {
    await conn.end();
  }

  return true;
}

/**
 * Delete an existing product, including genres
 * @param {Number} product_id
 * @returns {Promise->Boolean}: true if delete transaction successful
 */
exports.deleteDescriptionByPID = async (product_id) => {
  let conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    await removeAllGenresForPID(product_id, conn);
    await conn.query(`
      DELETE FROM descriptions
      WHERE product_id=${product_id}
    `);
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    console.error(e);
    throw new Error('Error removing product description.');
  } finally {
    await conn.end();
  }

  return true;
}

/**
 * Update an existing product with optional title, description, and/or genres.
 * Updates supplied parameters, leaving rest unchanged
 * @param {Number} product_id
 * @param {String?} title
 * @param {String?} description
 * @param {Array?} genres (note that invalid genres in the array will result in record not being updated)
 * @returns {Promise->Boolean}: true if update transaction successful
 */
exports.updateDescriptionForPID = async (product_id, title = null, description = null, genres = null) => {
  let conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    if (genres && genres.length) {
      await removeAllGenresForPID(product_id, conn);
      for (let i = 0; i < genres.length; i++) {
        await addGenreForPIDAsTransaction(product_id, genres[i], conn);
      }
    }

    if (title || description) {
      let updateFields = {};
      title ? updateFields.title = title : 0;
      description ? updateFields.description = description : 0;

      await conn.query(`
        UPDATE descriptions
        SET ${title ? `title='${title}'` : ''}
        ${title && description ? ',' : ''}
        ${description ? `description='${description}'` : ''}
        WHERE product_id=${product_id}
      `);
    }

    await conn.commit();
  } catch (e) {
    await conn.rollback();
    console.error(e);
    throw new Error('Error updating product description.');
  } finally {
    await conn.end();
  }

  return true;
}

