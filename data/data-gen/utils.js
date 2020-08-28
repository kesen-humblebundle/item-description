/**
 * Convert an object to a single csv line
 * @param {Object} obj: all values must be type string
 * @param {Array} keys: order to write keys in obj to writeStream (as key order is not assured in input obj)
 * @returns {String} line of CSV
 */
exports.convertObjToCSV = (obj, keys) => {
  let csvLine = '';
  keys.forEach((key, idx) => {
    if (typeof obj[key] === 'string') {
      // If value at key contains comma, wrap in quotes to distinguish from separator commas
      csvLine += obj[key].indexOf(',') !== -1 ? `"${obj[key]}"` : obj[key];
    }
    csvLine += idx === keys.length - 1 ? '\r\n' : ',';
  });
  return csvLine;
}
