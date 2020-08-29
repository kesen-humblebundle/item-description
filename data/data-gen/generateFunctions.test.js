const fs = require('fs');
const { PassThrough } = require('stream');
const { generateGenres } = require('./generateGenres');
const { generateGamesGenres } = require('./generateGamesGenres');
const { generateDescriptions } = require('./generateDescriptions');

// Mock file system and createWriteStream
fs.createWriteStream = jest.fn();

describe('Data generation functions', () => {
  test('should write output to the input file path', () => {
    jest.spyOn(fs, 'createWriteStream');
    fs.createWriteStream.mockImplementation(() => {
      const mockedStream = new PassThrough();
      mockedStream.on = () => {};
      mockedStream.write = () => {};
      mockedStream.end = () => {};
      return mockedStream;
    });


    generateGenres(['Action', 'RPG'], '/some/file/path');
    expect(fs.createWriteStream.mock.calls[0][0]).toBe('/some/file/path/genres.csv');

    generateGamesGenres(3, 4, '/some/file/path');
    expect(fs.createWriteStream.mock.calls[1][0]).toBe('/some/file/path/games_genres.csv');

    generateDescriptions(5, '/some/file/path');
    expect(fs.createWriteStream.mock.calls[2][0]).toBe('/some/file/path/descriptions.csv');
  });
});

jest.clearAllMocks();
