module.exports = {
  default: {
    require: [
      'src/steps/**/*.ts',
      'src/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress', 
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'allure-cucumberjs/reporter:reports/allure-results'
    ],
    timeout: 30000,
    parallel: 3,
    retry: 1,
    tags: '@automated',
    dryRun: false,
    exit: true
  },
  allure: {
    require: [
      'src/steps/**/*.ts',
      'src/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'allure-cucumberjs/reporter:reports/allure-results',
      'json:reports/cucumber-report.json'
    ],
    timeout: 30000,
    parallel: 3,
    retry: 1,
    tags: '@automated'
  },
  nightly: {
    require: [
      'src/steps/**/*.ts',
      'src/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress',
      'html:reports/nightly/cucumber-report.html',
      'json:reports/nightly/cucumber-report.json', 
      'allure-cucumberjs/reporter:reports/nightly/allure-results'
    ],
    timeout: 60000,  // Увеличенный timeout для ночных тестов
    parallel: 3,
    retry: 2,        // Больше попыток для ночных тестов
    tags: '@automated and not @manual'
  }
};
