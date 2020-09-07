/**
 * DO NOT USE - CRASHES AT 87% GAMES_GENRES SEED COMPLETION DUE TO MEMORY LEAK.
 *
 * Combed through my code for possible references that haven't been dereferenced, but unable to find any.
 * RavenDB's bulkInsert is the most likely culprit. (Journal post #4 details the list of evidence I've found online regarding batch insertion weaknesses with RavenDB)
 *
 * Code may be used later when issue is solved. Possible solutions:
 * - Seed 5M * range(3,5) games_genres at a time, i.e. split the script into 2 or more processes. (10M descriptions seeds in 1 process without heap problems) (credit Leslie)
 * - Start node with higher heap memory allocation with: node --max-old-space-size=<memory-in-Mb> db/seedRavenDB.js (credit moi e.e)
 * - Pause manually between bulkInsertions to allow garbage collection to catch up (credit Leslie)
 */

console.error('Exiting script due to known memory leak issue. See db/data-gen/seedRavenDB.js for details, and use at your own risk.');
process.exit(1);

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');

const store = require('./ravendb');
const { Genre } = require('./ravenEntities');
const { generateDescriptionsWithoutWrite } = require('./data-gen/generateDescriptions');
const { generateGamesGenresWithoutWrite } = require('./data-gen/generateGamesGenres');

/**
 * Given a valid input file path to a CSV file, pipe contents to csv-parser
 * and return an array of records in object format on completion.
 * @param {String} csvPath: path to csv file
 * @returns {Promise->Array}
 */
const parseCSVFile = (csvPath) => {
  return new Promise((resolve, reject) => {
    let records = [];
    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('data', record => {
        records.push(record);
      })
      .on('end', () => resolve(records))
      .on('error', err => reject(err));
  });

}

/**
 * Seeds database with genres from ${csvDir}/genres.csv
 * @param {String} csvDir
 * @returns {Promise->Boolean} true if seed operation successful
 */
const seedGenres = async (csvDir) => {
  // Acquire parsed genre.csv records from input csvDir
  let records = await parseCSVFile(`${csvDir}/genres.csv`);

  // Insert records from parsed CSV as bulkInsert operation
  const bulkInsert = store.bulkInsert();
  for (const genreObj of records) {
    const genre = new Genre(genreObj.id, genreObj.name);
    await bulkInsert.store(genre);
  }

  await bulkInsert.finish();
  console.log('Genres collection seeding complete.');
  return true;
}

/**
 * Seeds database with all descriptions CSV files from csvDir
 * @returns {Promise->Boolean} true if seed operation successful
 */
const seedDescriptions = async () => {
  // Generate & bulkInsert into DB in chunks of 10k
  const GENERATE_LIMIT = 10000;

  for (let i = 0; i < 1e7; i += GENERATE_LIMIT) {
    let documents = generateDescriptionsWithoutWrite(GENERATE_LIMIT, i + 1);

    const bulkInsert = store.bulkInsert();

    for (let j = 0; j < documents.length; j++) {
      await bulkInsert.store(documents[j]);
    }

    await bulkInsert.finish();

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${parseFloat(i / 1e7 * 100).toFixed(2)}% of descriptions seeded.`);
  }


  return true;
}

/**
 * Seeds database with all games_genres CSV files from csvDir
 * @param {String} csvDir
 * @param {Array} filenames: array of filename strings matching /games_genres_\d+\.csv/ at csvDir
 * @returns {Promise->Boolean} true if seed operation successful
 */
const seedGameGenres = async () => {
  // Generate data and bulkInsert in chunks of roughly 10k (1000 * range(3,5) ~= 10k)
  const GENERATE_LIMIT = 1000;
  let startId = 1;

  for (let i = 0; i < 1e7; i += GENERATE_LIMIT) {
    let documents = generateGamesGenresWithoutWrite(GENERATE_LIMIT, 53, startId);

    const bulkInsert = store.bulkInsert();

    for (let j = 0; j < documents.length; j++) {
      await bulkInsert.store(documents[j]);
    }

    startId += documents.length;
    await bulkInsert.finish();

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${parseFloat(i / 1e7 * 100).toFixed(2)}% of games_genres seeded. Current id: ${startId}`);
  }

  return true;
}
// const seedGameGenres = async (csvDir, filenames) => {
//   for (let i = 0; i < filenames.length; i++) {
//     // Acquire parsed genre.csv records from input csvDir
//     let records = await parseCSVFile(`${csvDir}/${filenames[i]}`);

//     // Insert records from parsed CSV as bulkInsert operation
//     const bulkInsert = store.bulkInsert();
//     for (const ggObj of records) {
//       const gg = new GameGenre(ggObj.id, ggObj.product_id, ggObj.genre_id);
//       await bulkInsert.store(gg);
//     }

//     await bulkInsert.finish();

//     process.stdout.clearLine();
//     process.stdout.cursorTo(0);
//     process.stdout.write(`${i} / ${filenames.length} games_genres files seeded`);
//   }

//   return true;
// }

/**
 * Main seeding function, called on running node db/seedRavenDB.js.
 * Parses CSV from input directory, then inserts documents into RavenDB.
 * NOTES:
 * - databases 'item_descriptions' and 'item_descriptions_test' must be created beforehand via studio GUI at http://localhost:${RDBPORT} (default 8080)
 * - collections are parsed automatically through inserting items as class instances
 * - id is specified in all insertion calls to set deterministic primary keys, instead of allowing RavenDB uuid generation
 */
const seed = async () => {
  let defaultCSVDirPath = process.env.NODE_ENV === 'test' ?
    path.resolve(__dirname, '..', 'tests', 'fixtures') :
    path.resolve(__dirname, 'data-gen', 'csv');

  let args = JSON.parse(process.env.npm_config_argv).original;
  let csvDir = args.find(elt => /--dir=/.test(elt));

  // Check if valid csvDir (ensuring path originates from project root instead of db/ dir)
  if (csvDir) {
    csvDir = path.resolve(__dirname, '..', csvDir.replace('--dir=', ''));
    try {
      await fs.promises.stat(csvDir);
    } catch (err) {
      console.error(`Invalid directory ${csvDir}.`);
      process.exit(1);
    }
  } else {
    csvDir = defaultCSVDirPath;
  }

  // let files = await fs.promises.readdir(csvDir);
  // let descCSVs = files.filter(file => /descriptions_\d+\.csv/.test(file));
  // let gameGenresCSVs = files.filter(file => /games_genres_\d+\.csv/.test(file));

  try {
    console.log('\nSeeding Genres collection...');
    await seedGenres(csvDir);

    console.log('\nSeeding GameGenres collection...');
    await seedGameGenres(/*csvDir, gameGenresCSVs*/);

    console.log('\nSeeding Descriptions collection...');
    await seedDescriptions(/*csvDir, descCSVs*/);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  if (process.env.NODE_ENV !== 'test') {
    process.exit(0);
  }
}

exports.seed = seed;

if (process.env.NODE_ENV !== 'test') {
  seed();
}

