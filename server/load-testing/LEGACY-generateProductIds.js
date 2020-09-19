const fs = require('fs');
const path = require('path');

/**
 * DEPRECATED, USING k6 instead - A one-use function that generates ids in the inclusive range 9mil - 10mil to CSV for use with Artillery
 */
const generateProductIds = async () => {
  const writePath = path.resolve(__dirname, 'productIds.csv')
  const stream = fs.createWriteStream(writePath);

  // Declare listeners
  stream.on('error', err => {
    throw err;
  });
  stream.on('close', () => {
    console.log(`Finished writing ids to CSV. Check ${writePath}`);
  });

  // Write nums 9e6 - 1e7 to CSV
  for (let i = 9e6; i <= 1e7; i++) {
    let isWritable = stream.write(`${i}\r\n`);

    if (!isWritable) {
      await new Promise(resolve => stream.once('drain', () => {
        resolve();
      }));
    }
  }

  stream.end();
  return true;
}

generateProductIds();
