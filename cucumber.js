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
    failFast: true, // Stop on first failure
    strict: false,
    paths: ['features/**/*.feature'],
    parallel: 1, // ONLY 1 PROCESS AT A TIME
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
