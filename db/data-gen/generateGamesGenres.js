const fs = require('fs');
const path = require('path');
const { convertObjToCSV, getRandomInRange } = require('./utils');
const { GameGenre } = require('../ravenEntities');

/**
 * Write numRecords * (range(3,5)) number of game-genre connections, each with product_id & genre_id fields, to CSV file at outDir
 * @param {Number} numRecords: number between 1 and 10 million, inclusive
 * @param {Number} numGenres: number of genres, needed to generate valid genre_ids
 * @param {String} outDir: directory to write resulting CSV file to
 * @returns {Promise->Boolean}
 */
exports.generateGamesGenres = async (numRecords, numGenres, outDir) => {
  // Remove existing games_genres_<index>.csv files
  let files = await fs.promises.readdir(outDir);
  files = files.filter(file => /games_genres_*\d*\.csv/.test(file));
  files.forEach(file => fs.unlink(path.join(outDir, file), (err) => {
    if (err) throw err;
  }));

  console.log(`\nWriting ${numRecords} games_genres id pairs to file. For 10M records, this will take around 2 minutes. Please wait...`);
  let id = 1;
  let fileId = 1;
  let keys = ['id', 'product_id', 'genre_id'];
  let stream;
  const ROW_LIMIT = 1e4;

  // Loop through numRecords, writing each to file with a limit of 100000 rows,
  // waiting for write buffer to drain every time it fills
  for (let i = 0; i < numRecords; i++) {

    // Create a new file stream every 100000 records
    if (i % ROW_LIMIT === 0) {
      stream && stream.end();
      stream = fs.createWriteStream(`${outDir}/games_genres_${fileId}.csv`);

      // Declare listeners
      stream.on('error', err => {
        throw err;
      });

      // Write headers
      stream.write(`${keys.join(',')}\r\n`);

      fileId++;
    }

    let usedGenres = [];

    // For each record, generate 3-5 genre pairs and convert to CSV before storing
    let csvLinesForRecord = [];
    let genreCount = getRandomInRange(3, 5);
    usedGenres.length = 0;

    for (let k = 0; k < genreCount; k++) {
      let genreId;

      do {
        genreId = getRandomInRange(1, numGenres);
      } while (usedGenres.includes(genreId));

      usedGenres.push(genreId);
      csvLinesForRecord.push(convertObjToCSV({ id, product_id: i + 1, genre_id: genreId }, keys));
      id++;
    }

    // stream.write returns a boolean indicating whether there is space left in the buffer
    let isWritable = stream.write(csvLinesForRecord.join(''));

    // If no space left in buffer, must wait for drain event to be emitted before
    // further write calls to avoid clogging the buffer & throwing error
    if (!isWritable) {
      await new Promise(resolve => stream.once('drain', () => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`${i} / ${numRecords} id pairs written.`);
        resolve();
      }));
    }
  } // end for loop numFiles

  stream && stream.end();
  console.log(`\n${numRecords % ROW_LIMIT === 0 ? fileId - 1 : fileId} games_genres files of <=${ROW_LIMIT} records each generated. Check ${outDir}\\games_genres_<index>.csv.`);
  return true;
}

/**
 * Generates & returns games_genres data as an array of Genres instances, for use with RavenDB
 * @param {Number} numToGenerate: number in range 1 to 2500, inclusive
 * @param {Number} numGenres
 * @param {Number} startId: starting id primary key
 * @returns {Array[GameGenre]}
 */
exports.generateGamesGenresWithoutWrite = (numToGenerate, numGenres, startId) => {
  if (numToGenerate > 2500) throw new Error('Data generation must not exceed 10000 products per function call');

  let documents = [];
  let usedGenres = [];

  for (let i = 0; i < numToGenerate; i++) {
    usedGenres = [];
    let genreCount = getRandomInRange(3, 5);

    for (let k = 0; k < genreCount; k++) {
      let genreId;

      do {
        genreId = getRandomInRange(1, numGenres);
      } while (usedGenres.includes(genreId));

      usedGenres.push(genreId);
      documents.push(new GameGenre(startId, i + 1, genreId));
      startId++;
    }
  }

  return documents;
}

/**
 *
 */
exports.generateGamesGenresForRaven = async (numRecords, numGenres, outDir) => {
  console.log(`\nWriting ${numRecords} games_genres id pairs to file for RavenDB. For 10M records, this will take around 2 minutes. Please wait...`);
  let id = 1;
  let keys = ['@id', 'product_id', 'genre_id', '@metadata.@collection'];

  const stream = fs.createWriteStream(`${outDir}/games_genres_raven.csv`);
  // Declare listeners
  stream.on('error', err => {
    throw err;
  });

  // Write headers
  stream.write(`${keys.join(',')}\r\n`);

  // Loop through numRecords, writing each to file,
  // waiting for write buffer to drain every time it fills
  for (let i = 0; i < numRecords; i++) {
    let usedGenres = [];

    // For each record, generate 3-5 genre pairs and convert to CSV before storing
    let csvLinesForRecord = [];
    let genreCount = getRandomInRange(3, 5);
    usedGenres.length = 0;

    for (let k = 0; k < genreCount; k++) {
      let genreId;

      do {
        genreId = getRandomInRange(1, numGenres);
      } while (usedGenres.includes(genreId));

      usedGenres.push(genreId);
      csvLinesForRecord.push(convertObjToCSV({ '@id': `GameGenres/${id}`, product_id: `Descriptions/${i + 1}`, genre_id: `Genres/${genreId}`, '@metadata.@collection': 'GameGenres' }, keys));
      id++;
    }

    // stream.write returns a boolean indicating whether there is space left in the buffer
    let isWritable = stream.write(csvLinesForRecord.join(''));

    // If no space left in buffer, must wait for drain event to be emitted before
    // further write calls to avoid clogging the buffer & throwing error
    if (!isWritable) {
      await new Promise(resolve => stream.once('drain', () => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`${i} / ${numRecords} id pairs written.`);
        resolve();
      }));
    }
  } // end for loop numFiles

  stream.end();
  console.log(`\ngames_genres records generated. Check ${outDir}\\games_genres_<index>.csv.`);
  return true;
}
