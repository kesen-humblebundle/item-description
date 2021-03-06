const fs = require('fs');
const path = require('path');
const { convertObjToCSV, generatePhrase, generateSentence } = require('./utils');
const { Description } = require('../ravenEntities');

/**
 * Write numRecords number of descriptions, each with title & description fields, to CSV file at outDir
 * @param {Number} numRecords: number between 1 and 10 million, inclusive
 * @param {String} outDir: directory to write resulting CSV file to
 * @returns {Promise->Boolean}
 */
exports.generateDescriptions = async (numRecords, outDir) => {
  // Remove existing descriptions_<index>.csv files
  let files = await fs.promises.readdir(outDir);
  files = files.filter(file => /descriptions_*\d*\.csv/.test(file));
  files.forEach(file => fs.unlink(path.join(outDir, file), (err) => {
    if (err) throw err;
  }));

  console.log(`\nWriting ${numRecords} descriptions to file. For 10M records, this will take around 4 minutes. Please wait...`);
  let fileId = 1;
  let keys = ['id', 'title', 'description'];
  let stream;

  // Loop through numRecords, writing each to file, waiting for write buffer to drain every time it fills
  for (let i = 0; i < numRecords; i++) {

    // Create a new file stream every 10000 records
    if (i % 10000 === 0) {
      stream && stream.end();
      stream = fs.createWriteStream(`${outDir}/descriptions_${fileId}.csv`);

      // Declare listeners
      stream.on('error', err => {
        throw err;
      });

      // Write headers
      stream.write(`${keys.join(',')}\r\n`);

      fileId++;
    }

    // Generate record as object
    let record = {
      id: i + 1,
      title: generatePhrase(true),
      description: `"${generateSentence()} ${generateSentence()} ${generateSentence()}\n` +
      `${generateSentence()} ${generateSentence()} ${generateSentence()}\n` +
      `${generateSentence()} ${generateSentence()} ${generateSentence()}"`
    }

    // stream.write returns a boolean indicating whether there is space left in the buffer
    let isWritable = stream.write(convertObjToCSV(record, keys));

    // If no space left in buffer, must wait for drain event to be emitted before
    // further write calls to avoid clogging the buffer & throwing error
    if (!isWritable) {
      await new Promise(resolve => stream.once('drain', () => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`${i} / ${numRecords} descriptions written.`);
        resolve();
      }));
    }
  } // end for loop

  stream && stream.end();
  console.log(`\n${numRecords % 10000 === 0 ? fileId - 1 : fileId} descriptions files of <= 10000 records each generated. Check ${outDir}\\descriptions_<index>.csv.`);
  return true;
}

/**
 * Generates & returns descriptions data as an array of Descriptions instances, for use with RavenDB
 * @param {Number} numToGenerate: number in range 1 to 10000, inclusive
 * @param {Number} startId: starting id primary key
 * @returns {Array[Description]}
 */
exports.generateDescriptionsWithoutWrite = (numToGenerate, startId) => {
  if (numToGenerate > 10000) throw new Error('Data generation must not exceed 10000 products per function call');

  let documents = [];

  // Generate numToGenerate documents
  for (let i = 0; i < numToGenerate; i++) {
    documents.push(
      new Description(
        startId,
        generatePhrase(true),
        `"${generateSentence()} ${generateSentence()} ${generateSentence()}\n` +
        `${generateSentence()} ${generateSentence()} ${generateSentence()}\n` +
        `${generateSentence()} ${generateSentence()} ${generateSentence()}"`
      )
    );
    startId++;
  }

  return documents;
}

/**
 * Write numRecords number of descriptions, each with title & description fields, to CSV file at outDir
 * @param {Number} numRecords: number between 1 and 10 million, inclusive
 * @param {String} outDir: directory to write resulting CSV file to
 * @returns {Promise->Boolean}
 */
exports.generateDescriptionsForRaven = async (numRecords, outDir) => {
  console.log(`\nWriting ${numRecords} descriptions to file for RavenDB. For 10M records, this will take around 4 minutes. Please wait...`);
  let keys = ['@id', 'title', 'description', '@metadata.@collection'];
  const stream = fs.createWriteStream(`${outDir}/descriptions_raven.csv`);

  // Declare listeners
  stream.on('error', err => {
    throw err;
  });

  // Write headers
  stream.write(`${keys.join(',')}\r\n`);

  // Loop through numRecords, writing each to file, waiting for write buffer to drain every time it fills
  for (let i = 0; i < numRecords; i++) {
    // Generate record as object
    let record = {
      '@id': `Descriptions/${i + 1}`,
      title: generatePhrase(true),
      description: `"${generateSentence()} ${generateSentence()} ${generateSentence()}\n` +
      `${generateSentence()} ${generateSentence()} ${generateSentence()}\n` +
      `${generateSentence()} ${generateSentence()} ${generateSentence()}"`,
      '@metadata.@collection': 'Descriptions'
    }

    // stream.write returns a boolean indicating whether there is space left in the buffer
    let isWritable = stream.write(convertObjToCSV(record, keys));

    // If no space left in buffer, must wait for drain event to be emitted before
    // further write calls to avoid clogging the buffer & throwing error
    if (!isWritable) {
      await new Promise(resolve => stream.once('drain', () => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`${i} / ${numRecords} descriptions written.`);
        resolve();
      }));
    }
  } // end for loop

  stream.end();
  console.log(`\n${numRecords} descriptions generated for RavenDB. Check ${outDir}\\descriptions_raven.csv.`);
  return true;
}
