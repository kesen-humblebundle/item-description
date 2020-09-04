const fs = require('fs');
const path = require('path');
const { generateGenres } = require('./generateGenres');
const { generateDescriptions } = require('./generateDescriptions');
const { generateGamesGenres } = require('./generateGamesGenres');

const defaultPath = path.resolve(__dirname, 'csv');

const usageMessage =
`Usage:
  npm run data:gen

Config options:
  --overwrite   Whether to overwrite existing generated CSV data
                      [boolean]  [default: false]
  --outDir      Path to write CSV data to from project root
                      [string]   [default: './db/data-gen/csv']
  --numRecords  Number of CSV lines to generate for descriptions dataset. Games_genres dataset will be a multiple of this number.
                      [integer]  [default: 10000]  [range: 1 - 10000000]`;

// Extracted & simplified genres from: https://en.wikipedia.org/wiki/List_of_video_game_genres
const genres = [
  'Platform',
  'Shooter',
  'Fighting',
  'Beat \'em up',
  'Stealth',
  'Survival',
  'Battle Royale',
  'Rhythm',
  'Survival Horror',
  'Metroidvania',
  'Text',
  'Graphic',
  'Visual Novel',
  'Interactive Movie',
  'Real-time 3D',
  'Action RPG',
  'MMORPG',
  'Roguelike',
  'Tactical RPG',
  'Sandbox RPG',
  'JRPG',
  'Monster Collection',
  'Simulation',
  '4X',
  'Artillery',
  'Auto Battler',
  'MOBA',
  'Real-Time Strategy',
  'Real-Time Tactics',
  'Tower Defense',
  'Turn-Based Strategy',
  'Turn-Based Tactics',
  'Wargame',
  'Racing',
  'Sports',
  'Competitive',
  'Board Game',
  'Card Game',
  'Casual',
  'Horror',
  'Logic',
  'MMO',
  'Mobile',
  'Party',
  'Programming',
  'Trivia',
  'Idle',
  'Narrative',
  'Sandbox',
  'Creative',
  'Open World',
  'Puzzle',
  'Mystery'
];

/**
 * Extracts the CLI args passed as the args field in `npm run data:gen [args]`,
 * using default args if no flag(s) passed. If invalid args found, exits node process.
 * @returns {Promise->Object} resolves to an object containing valid parsed arguments.
 */
const extractCLIArgs = () => {
  // If calling node data/data-gen/index.js directly, exit process with error
  if (!process.env.npm_config_argv) {
    console.error(usageMessage);
    process.exit(1);
  }

  let cliArgs = JSON.parse(process.env.npm_config_argv).original;
  cliArgs = cliArgs.slice(cliArgs.indexOf('data:gen') + 1);

  let parsedArgs = {
    overwrite: (() => {
      let overwriteFlag = cliArgs.find(elt => /--overwrite/.test(elt));
      if (/--overwrite=(?!(false|true))/.test(overwriteFlag)) {
        console.error(usageMessage);
        process.exit(1);
      }
      return overwriteFlag === '--overwrite=true' || overwriteFlag === '--overwrite';
    })(),
    outDir: (() => {
      let outDirFlag = cliArgs.find(elt => /--outDir/.test(elt));
      // Only checks if valid string. Valid directory location is checked later.
      if (outDirFlag && outDirFlag.indexOf('=') !== -1 && outDirFlag.length > '--outDir='.length) {
        return outDirFlag.split('=')[1];
      }
      return defaultPath;
    })(),
    numRecords: (() => {
      let numFlag = cliArgs.find(elt => /--numRecords/.test(elt));
      if (numFlag && numFlag.indexOf('=') !== -1 && numFlag.length > '--numFlag='.length) {
        let num = parseInt(numFlag.split('=')[1]);
        if (Number.isNaN(num) || num < 1 || num > 10000000) {
          console.error(usageMessage);
          process.exit(1);
        }
        return num;
      }
      return 10000;
    })()
  } // end parsedArgs

  // Ensure valid outDir location, if present
  return fs.promises.stat(parsedArgs.outDir)
    .then(() => parsedArgs)
    .catch(() => {
      // Catch block will only be entered if invalid directory
      console.error(usageMessage);
      process.exit(1);
    })
}

/**
 * Main function called on running CLI script. Ensure valid arguments, then generate data to .csv
 */
const parseArgsAndRunDataGen = async () => {
  let { overwrite, outDir, numRecords } = await extractCLIArgs();
  // Set outDir as originating from project root instead of db/data-gen/
  outDir = path.resolve(__dirname, '..', '..', outDir);
  try {
    let files = await fs.promises.readdir(outDir);
    if (!overwrite && (files.includes('genres.csv') || files.includes('descriptions.csv') || files.includes('games_genres.csv'))) {
      throw new Error(`\nError: Some or all files already generated. Check ${outDir}.\n`);
    }

    await generateGenres(genres, outDir);
    await generateDescriptions(numRecords, outDir);
    await generateGamesGenres(numRecords, genres.length, outDir);
  } catch (e) {
    console.error(e.message);
    console.error(usageMessage);
    process.exit(1);
  }
}

parseArgsAndRunDataGen();


