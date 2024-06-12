const config = {
    reporters: [
      'default',
      ['jest-junit', {outputDirectory: 'test-results', outputName: 'report.xml'}],
    ],
  };
  module.exports = config;