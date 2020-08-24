require("dotenv").config();

module.exports = {
  globalSetup: './tests/globalTestSetup.js',
  globalTeardown: './tests/globalTestTeardown.js',
  globals: {
    PORT: 5151,
    NODE_ENV: 'test'
  },
  testEnvironment: 'jsdom',
  verbose: true
};
