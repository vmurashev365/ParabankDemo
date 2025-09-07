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
    timeout: 30000, // 30 секунд timeout для всех шагов
    paths: ['features/**/*.feature'],
    parallel: 3, // Уменьшаем параллельность для стабильности
    retry: 1, // Один retry для нестабильных тестов
    worldParameters: {
      headless: false,
      slowMo: 200,
      browser: 'chromium'
    }
  }
};

module.exports = config;
