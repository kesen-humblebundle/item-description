const fs = require('fs');
const { convertObjToCSV, getRandomInRange } = require('./utils');

/**
 * Write numRecords * (range(3,5)) number of game-genre connections, each with product_id & genre_id fields, to CSV file at outDir
 * @param {Number} numRecords: number between 1 and 10 million, inclusive
 * @param {Number} numGenres: number of genres, needed to generate valid genre_ids
 * @param {String} outDir: directory to write resulting CSV file to
 * @returns {Promise->Boolean}
 */
exports.generateGamesGenres = async (numRecords, numGenres, outDir) => {
  const stream = fs.createWriteStream(`${outDir}/games_genres.csv`);

  // Declare listeners
  stream.on('error', err => {
    throw err;
  });

  stream.on('close', () => {
    console.log(`\nGames_genres file generated. Check ${outDir}\\games_genres.csv.`);
  });

  stream.on('open', () => {
    console.log(`\nWriting ${numRecords} games_genres id pairs to file. For 10M records, this will take around 2 minutes. Please wait...`);
  });

  // Write headers
  let keys = ['id', 'product_id', 'genre_id'];
  stream.write(`${keys.join(',')}\r\n`);

  let usedGenres = [];
  let id = 1;
  // Loop through numRecords, writing each to file, waiting for write buffer to drain every time it fills
  for (let i = 0; i < numRecords; i++) {
    // For each record, generate 3-5 genre pairs and convert to CSV before storing
    let csvLinesForRecord = [];
    let genreCount = getRandomInRange(3, 5);
    usedGenres.length = 0;

    for (let j = 0; j < genreCount; j++) {
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
  } // end for loop

  stream.end();
  return true;
}
