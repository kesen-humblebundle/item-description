const { nouns, adjectives, adverbs, verbs } = require('./wordBank');

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
    } else if (typeof obj[key] === 'number') {
      csvLine += obj[key];
    }
    csvLine += idx === keys.length - 1 ? '\r\n' : ',';
  });
  return csvLine;
}

/**
 * Get a random number between min and max, inclusive
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
const getRandomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getRandomInRange = getRandomInRange;

/**
 * Generate a phrase in the pattern "<adv> <adj> <noun>"
 * @param {Boolean} isTitleCase: whether to capitalize all words
 * @returns {String}
 */
const generatePhrase = (isTitleCase = false) => {
  let adv = adverbs[getRandomInRange(0, adverbs.length - 1)];
  let adj = adjectives[getRandomInRange(0, adjectives.length - 1)];
  let noun = nouns[getRandomInRange(0, nouns.length - 1)];

  return isTitleCase ?
    `${adv.charAt(0).toUpperCase() + adv.slice(1)} ${adj.charAt(0).toUpperCase() + adj.slice(1)} ${noun.charAt(0).toUpperCase() + noun.slice(1)}` :
    `${adv} ${adj} ${noun}`;
}
exports.generatePhrase = generatePhrase;

/**
 * Generate a sentence in the pattern "<adv> <adj> <noun> <verb> <adv> <adj> <noun>."
 * @returns {String}
 */
exports.generateSentence = () => {
  let verb = verbs[getRandomInRange(0, verbs.length - 1)];

  let firstPhrase = generatePhrase();
  firstPhrase = firstPhrase.charAt(0).toUpperCase() + firstPhrase.slice(1);

  return `${firstPhrase} ${verb} ${generatePhrase()}.`;
}
