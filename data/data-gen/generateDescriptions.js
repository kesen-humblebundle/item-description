const fs = require('fs');
const { convertObjToCSV, generatePhrase, generateSentence } = require('./utils');

/**
 * Write numRecords number of descriptions, each with title & description fields, to CSV file at outDir
 * @param {Number} numRecords: number between 1 and 10 million, inclusive
 * @param {String} outDir: directory to write resulting CSV file to
 * @returns {Promise->Boolean}
 */
exports.generateDescriptions = async (numRecords, outDir) => {
  const stream = fs.createWriteStream(`${outDir}/descriptions.csv`);

  // Declare listeners
  stream.on('error', err => {
    throw err;
  });

  stream.on('close', () => {
    console.log(`\nDescriptions file generated. Check ${outDir}\\descriptions.csv.`);
  });

  stream.on('open', () => {
    console.log(`\nWriting ${numRecords} descriptions to file. For 10M records, this will take around 4 minutes. Please wait...`);
  });


  // Write headers
  let keys = ['id', 'title', 'description'];
  stream.write(`${keys.join(',')}\r\n`);

  // Loop through numRecords, writing each to file, waiting for write buffer to drain every time it fills
  for (let i = 0; i < numRecords; i++) {
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

  stream.end();
  return true;
}
