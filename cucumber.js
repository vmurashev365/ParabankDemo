const config = {
  default: {
    require: [
      'ts-node/register',
      'src/support/world.ts',
      'src/support/hooks.ts',
      'src/steps/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    dryRun: false,
    failFast: false, // Don't stop on first failure in parallel mode
    strict: false,
    paths: ['features/**/*.feature'],
    parallel: 5, // Maximum 5 parallel processes
    retry: 0, // No retries for now
    timeout: 120000, // 2 minutes
    worldParameters: {
      headless: false,
      slowMo: 200,
      browser: 'chromium'
    }
  }
};

module.exports = config;
