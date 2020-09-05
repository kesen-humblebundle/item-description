require("dotenv").config();

module.exports = {
  globalSetup: './tests/globalTestSetup.js',
  globalTeardown: './tests/globalTestTeardown.js',
  globals: {
    NODE_ENV: 'test'
  },
  testEnvironment: 'jsdom',
  verbose: true
};
