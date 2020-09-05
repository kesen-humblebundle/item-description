const fs = require('fs');

/**
 * Generates an input array of genres as a CSV file at outDir
 * @param {Array[String]} genres
 * @param {String} outDir
 * @returns {Promise->Boolean}
 */
exports.generateGenres = async (genres, outDir) => {
  return new Promise((resolve, reject) => {
    let stream = fs.createWriteStream(`${outDir}/genres.csv`);

    stream.on('error', err => {
      reject(err);
    });
    stream.on('close', () => {
      console.log(`Genres file generated. Check ${outDir}\\genres.csv.`);
      resolve(true);
    });

    // Write CSV header, then body
    stream.write('id,name\r\n');
    genres.forEach((genre, idx) => {
      stream.write(`${idx + 1},${genre}\r\n`);
    });
    stream.end();
  });
}
