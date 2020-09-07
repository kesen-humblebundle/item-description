const fs = require('fs');

/**
 * Generates an input array of genres as a CSV file at outDir
 * @param {Array[String]} genres
 * @param {String} outDir
 * @param {Boolean} isRavenDB: if true, create csv file slightly differently to allow smooth addition to Raven database
 * @returns {Promise->Boolean}
 */
exports.generateGenres = async (genres, outDir, isRavenDB) => {
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
    stream.write(`${isRavenDB ? '@' : ''}id,name${isRavenDB ? ',@metadata.@collection' : ''}\r\n`);
    genres.forEach((genre, idx) => {
      stream.write(`${isRavenDB ? 'Genres/' : ''}${idx + 1},${genre}${isRavenDB ? ',Genres' : ''}\r\n`);
    });
    stream.end();
  });
}
