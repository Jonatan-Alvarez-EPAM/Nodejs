module.exports = {
  collectCoverage: true,
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx'
  ],
  transform: {
    '\\.(ts|tsx)$': 'ts-jest'
  },
  testRegex: '.*\\.spec\\.(ts|tsx)$'
};