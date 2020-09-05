require('dotenv').config();
const path = require('path');
const fs = require('fs');

const config = require('../dbconfig').mariadb[process.env.NODE_ENV];
const db = require('./mariadb');

let defaultCSVDirPath = process.env.NODE_ENV === 'test' ?
  path.resolve(__dirname, '..', 'tests', 'fixtures') :
  path.resolve(__dirname, 'data-gen', 'csv');

/**
 * Creates the 'item_descriptions' or 'item_descriptions_test' database,
 * depending on NODE_ENV
 * @param {Object} conn: MariaDB connection object
 */
const createDatabase = async (conn) => {
  await conn.query(`DROP DATABASE IF EXISTS ${config.database}`);
  await conn.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
  await conn.query(`USE ${config.database}`);
}

/**
 * Creates 'descriptions', 'games_genres', 'genres' tables
 * @param {Object} conn: MariaDB connection object
 */
const createTables = async (conn) => {
  await conn.query(`
    CREATE TABLE descriptions (
      product_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title TEXT,
      description TEXT
    )
  `);
  await conn.query(`
    CREATE TABLE genres (
      id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name TINYTEXT
    )
  `);
  await conn.query(`
    CREATE TABLE games_genres (
      id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES descriptions (product_id) ON DELETE CASCADE,
      genre_id INTEGER NOT NULL REFERENCES genres (id) ON DELETE CASCADE
    )
  `);
}

/**
 * Seeds created tables with CSV data from argv directory
 * @param {String} csvDir: location of CSV tables to insert into DB
 * @param {Object} conn: MariaDB connection object
 */
const insertData = async (csvDir, conn) => {
  let csvFiles = await fs.promises.readdir(csvDir);
  let descCsv = csvFiles.filter(fileName => /^descriptions_\d*\.csv$/.test(fileName));
  let gamesGenresCsv = csvFiles.filter(fileName => /^games_genres_\d*\.csv$/.test(fileName));

  // Seed genres.csv
  await conn.query(`
    LOAD DATA LOCAL INFILE ? INTO TABLE genres
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\r\n'
    IGNORE 1 LINES (id, name)
  `, [path.resolve(csvDir, 'genres.csv')]
  );
  console.log('Genres table seeding complete.');

  // Seed 30-50M games_genres
  for (let i = 0; i < gamesGenresCsv.length; i++) {
    await conn.query(`
      LOAD DATA LOCAL INFILE ? INTO TABLE games_genres
      FIELDS TERMINATED BY ','
      LINES TERMINATED BY '\r\n'
      IGNORE 1 LINES (id, product_id, genre_id)
    `, [path.resolve(csvDir, gamesGenresCsv[i])]
    );

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${i} / ${gamesGenresCsv.length} games_genres CSVs seeded.`);
  }
  console.log('\nGames_genres table seeding complete.');

  // Seed 10M descriptions
  for (let i = 0; i < descCsv.length; i++) {
    await conn.query(`
      LOAD DATA LOCAL INFILE ? INTO TABLE descriptions
      FIELDS
        TERMINATED BY ','
        OPTIONALLY ENCLOSED BY '"'
      LINES TERMINATED BY '\r\n'
      IGNORE 1 LINES (product_id, title, description)
    `, [path.resolve(csvDir, descCsv[i])]
    );

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${i} / ${descCsv.length} descriptions CSVs seeded.`);
  }
  console.log('\nDescriptions table seeding complete.');

}

const seed = async () => {
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
  }

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    console.log('Creating database...');
    await createDatabase(conn);

    console.log('Creating tables...');
    await createTables(conn);

    console.log(`Inserting data from ${csvDir || defaultCSVDirPath}, please wait...`);
    await insertData(csvDir || defaultCSVDirPath, conn);

    await conn.commit();
    await conn.end();
  } catch (err) {
    console.error(err);
    conn && await conn.rollback();
    conn && await conn.end();
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

