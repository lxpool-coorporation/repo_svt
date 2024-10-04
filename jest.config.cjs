// jest.config.js
module.exports = {
  setupFiles: ['./jest.setup.cjs'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.test.ts'],
};