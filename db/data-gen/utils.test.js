const { convertObjToCSV, getRandomInRange, generatePhrase, generateSentence } = require('./utils');
const { nouns, adjectives, adverbs, verbs } = require('./wordBank');

describe('Data generation utils', () => {
  describe('convertObjToCSV', () => {
    let keys = ['id', 'field1', 'field2'];

    test('should convert an object into a single CSV line, in input keys order', () => {
      expect(convertObjToCSV({
        id: 1,
        field1: 'abc',
        field2: 123
      }, keys)).toBe('1,abc,123\r\n');
    });

    test('should handle empty fields', () => {
      expect(convertObjToCSV({
        field1: 'abc',
        field2: 123
      }, keys)).toBe(',abc,123\r\n');
    });

    test('should handle commas in field data', () => {
      expect(convertObjToCSV({
        id: 1,
        field1: 'a,bc,d',
        field2: '1,23'
      }, keys)).toBe('1,"a,bc,d","1,23"\r\n');
    });
  });

  describe('getRandomInRange', () => {
    test('should get a random value in range, inclusive of both min and max input', () => {
      for (let i = 0; i < 50; i++) {
        let random = getRandomInRange(1, 10);
        expect(random).toBeGreaterThanOrEqual(1);
        expect(random).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('generatePhrase', () => {
    test('should generate a random three-word phrase in the adv-adj-noun pattern', () => {
      let phrase = generatePhrase().split(' ');
      expect(phrase).toHaveLength(3);
      expect(adverbs).toContain(phrase[0]);
      expect(adjectives).toContain(phrase[1]);
      expect(nouns).toContain(phrase[2]);
    });

    test('should title-case the result when passed a flag', () => {
      let title = generatePhrase(true).split(' ');
      expect(title).toHaveLength(3);
      title.forEach(word => {
        expect(word[0]).toBe(word[0].toUpperCase());
      });
    });
  });

  describe('generateSentence', () => {
    test('should generate a random 7-word sentence in the phrase-verb-phrase pattern', () => {
      let sentence = generateSentence().split(' ');
      expect(sentence).toHaveLength(7);

      // Start with capital letter
      expect(sentence[0][0]).toBe(sentence[0][0].toUpperCase());
      // End with period
      expect(sentence[sentence.length - 1].slice(-1)).toBe('.');

      // Follow correct pattern
      expect(adverbs).toContain(sentence[0].toLowerCase());
      expect(adjectives).toContain(sentence[1]);
      expect(nouns).toContain(sentence[2]);
      expect(verbs).toContain(sentence[3]);
      expect(adverbs).toContain(sentence[4]);
      expect(adjectives).toContain(sentence[5]);
      expect(nouns).toContain(sentence[6].replace('.', ''));
    });
  });
});

