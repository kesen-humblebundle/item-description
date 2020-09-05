// Require Node's built-in child_process API
const { execSync } = require('child_process');
const usageMessage =
`Usage:
  npm run server:dev

Config options:
  --db        Database to start server with, REQUIRED
                  [enum, one of: 'mariadb', 'couchdb']
  --env       NODE_ENV to start server with
                  [enum, one of: 'development', 'production', 'test']   [default: 'development']
  --nodemon   If present, starts the server child process with nodemon instead of node
                  [boolean]   [default: true]`;

/**
 * Parses the args passed to package.json server:dev script via process.env.npm_config_argv,
 * then executes `nodemon server/index.js` as a child process if valid args. Otherwise, exits with code 1
 */
const parseAndStartServer = () => {
  // Parse argv flags
  let args = JSON.parse(process.env.npm_config_argv).original
    .filter(elt => elt.includes('--'));

  let db = args.find(elt => /--db=/.test(elt));
  db = db ? db.replace('--db=', '') : '';

  let env = args.find(elt => /--env=/.test(elt)) || 'development';
  let useNodemon = args.find(elt => /--nodemon=/.test(elt));
  useNodemon = useNodemon ? useNodemon.replace('--nodemon=', '') : 'true';


  // Exec child process with flags passed as env vars
  // (execSync instead, since async .exec seems not to pipe stdout to the same terminal -- need to research later)
  if (
    !['mariadb', 'couchdb'].includes(db) ||
    !['development', 'production', 'test'].includes(env) ||
    !['true', 'false'].includes(useNodemon)
  ) {
    console.error(usageMessage);
    process.exit(1);
  } else {
    // Pass env vars to node or nodemon via cross-env, and set stdin, stdout, stderr to inherit from parent process
    execSync(`cross-env NODE_ENV=${env} DB=${db} ${useNodemon === 'false' ? 'node' : 'nodemon'} server/index.js`, { stdio: 'inherit' });
  }
}

parseAndStartServer();



