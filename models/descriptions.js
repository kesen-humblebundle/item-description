const db = require("../data/db.js");
const { getGenresByPID, removeAllGenresForPID } = require("./genres");

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

  let titleArr = await db
    .select('product_id', 'title')
    .from('descriptions')
    .whereIn('product_id', product_id);

  if (!titleArr.length) {
    throw new Error(`No titles found matching product id ${product_id}.`);
  }

  return titleArr;
}


/*********
 * UTILS *
 *********/

/**
 * Add genres to a product through passed in database transaction
 * @param {Number} product_id
 * @param {String} genre
 * @param {Function} trx: db transaction instance
 * @returns {Promise}
 */
const addGenreForPIDAsTransaction = async (product_id, genre, trx) => {
  let genreId = await trx('genres')
    .where({ name: genre })
    .select('id');

  if (!genreId) {
    throw new Error(`Invalid genre ${genre}. Please visit /genre/genres for a list of valid genres.`);
  }

  return await trx('games_genres')
    .insert([{ product_id, genre_id: genreId[0].id }]);
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
  let descriptionArr = await db
    .select()
    .from("descriptions")
    .where({ product_id });

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
  await db.transaction(async trx => {
    try {
      let insertedProductId = await trx('descriptions')
        .insert({ title, description }, ['product_id']);

      for (let i = 0; i < genres.length; i++) {
        await addGenreForPIDAsTransaction(insertedProductId[0].product_id, genres[i], trx);
      }
    } catch (e) {
      console.error(e);
      throw (e);
    }
  });

  return true;
}

/**
 * Delete an existing product, including genres
 * @param {Number} product_id
 * @returns {Promise->Boolean}: true if delete transaction successful
 */
exports.deleteDescriptionByPID = async (product_id) => {
  await db.transaction(async trx => {
    try {
      await removeAllGenresForPID(product_id, trx);
      await trx('descriptions')
        .where({ product_id })
        .del();
    } catch (e) {
      console.error(e);
      throw new Error('Error removing product description.');
    }
  });

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
  await db.transaction(async trx => {
    try {
      if (genres && genres.length) {
        await removeAllGenresForPID(product_id, trx);
        for (let i = 0; i < genres.length; i++) {
          await addGenreForPIDAsTransaction(product_id, genres[i], trx);
        }
      }

      if (title || description) {
        let updateFields = {};
        title ? updateFields.title = title : 0;
        description ? updateFields.description = description : 0;

        await trx('descriptions')
          .where({ product_id })
          .update(updateFields);
      }


    } catch (e) {
      console.error(e);
      throw new Error('Error updating product description.');
    }
  });

  return true;
}
