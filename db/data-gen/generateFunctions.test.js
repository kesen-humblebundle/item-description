const fs = require('fs');
const path = require('path');
const { generateGenres } = require('./generateGenres');
const { generateGamesGenres } = require('./generateGamesGenres');
const { generateDescriptions } = require('./generateDescriptions');

describe('Data generation functions', () => {
  let testDir = path.resolve(__dirname, '..', '..', 'tests');
  const numGames = 5;
  const numGenres = 6;

  beforeAll(async () => {
    console.log = jest.fn();
    await generateGenres(['Action', 'RPG'], testDir);
    await generateGamesGenres(numGames, numGenres, testDir);
    await generateDescriptions(numGames, testDir);
  });

  afterAll(async () => {
    await fs.promises.unlink(`${testDir}/genres.csv`);
    await fs.promises.unlink(`${testDir}/descriptions_1.csv`);
    await fs.promises.unlink(`${testDir}/games_genres_1.csv`);
  });

  test('should write data to the correct location with expected filenames', async () => {
    let dirContents = await fs.promises.readdir(testDir);
    expect(dirContents).toContain('genres.csv');
    expect(dirContents).toContain('descriptions_1.csv');
    expect(dirContents).toContain('games_genres_1.csv');
  });

  test('should write files with expected data', async () => {
    let genres = await fs.promises.readFile(`${testDir}/genres.csv`);
    let gamesGenres = await fs.promises.readFile(`${testDir}/games_genres_1.csv`);
    let descriptions = await fs.promises.readFile(`${testDir}/descriptions_1.csv`);

    // genres.csv
    expect(genres.toString()).toEqual('id,name\r\n1,Action\r\n2,RPG\r\n');

    // games_genres_1.csv
    // Convert from Buffer to String, split by line, remove last blank line
    gamesGenres = gamesGenres.toString().split('\r\n').filter(row => row);
    gamesGenres.forEach((row, idx) => {
      // Headers
      if (idx === 0) {
        expect(row).toEqual('id,product_id,genre_id');
        // Each row should have product_id between 1-5 and genre_id between 1-6 (matching input from beforeAll)
      } else {
        expect(row).toMatch(/\d,[1-5],[1-6]/);
      }
    });

    // descriptions_1.csv
    // Convert from Buffer to String, split by line, remove last blank line
    descriptions = descriptions.toString().split('\r\n').filter(row => row);
    descriptions.forEach((row, idx) => {
      if (idx === 0) {
        expect(row).toEqual('id,title,description');
      } else {
        // Just matching id & title - description is too much trouble to write RegExp for
        expect(row).toMatch(/\d+,[\w-]+\s[\w-]+\s[\w-]+/);
      }
    });
  });
});
