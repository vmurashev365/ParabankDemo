const path = require('path');

const featureGlob = path.join(__dirname, 'features/**/*.feature');
const stepsGlob = path.join(__dirname, 'src/steps/**/*.ts');
const supportGlob = path.join(__dirname, 'src/support/**/*.ts');
const reportPath = path.join(__dirname, '..', 'reports', 'v4-cucumber-report.html');

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [supportGlob, stepsGlob],
    format: ['progress', `html:${reportPath}`],
    publishQuiet: true,
    dryRun: false,
    failFast: false,
    strict: true,
    paths: [featureGlob],
    parallel: 2,
    retry: 0,
    worldParameters: {
      headless: process.env.PARABANK_HEADLESS === 'true',
      browser: process.env.PARABANK_BROWSER ?? 'chromium'
    }
  }
};
