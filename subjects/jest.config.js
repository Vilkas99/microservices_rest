/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "((\\.|/*.)(spec))\\.ts?$",
  silent: false,
  globalTeardown: "./teardown.ts",
  globalSetup: "./setup.ts",
};
