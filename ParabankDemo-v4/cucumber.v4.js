module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
    format: ['progress', 'html:reports/cucumber/report.html'],
    parallel: 1,
    worldParameters: {
      headless: process.env.PARABANK_HEADLESS !== 'false',
      browser: process.env.PARABANK_BROWSER ?? 'chromium',
    },
  },
};
