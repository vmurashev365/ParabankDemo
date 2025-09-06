# ParaBank BDD Automation

Automated testing for ParaBank application using Playwright, TypeScript, and Cucumber BDD.

## 📋 Project Overview

- **Total Test Cases**: 200
- **Automated**: 160 test cases
- **Manual**: 40 test cases (documented procedures)
- **Coverage**: 96% requirements coverage
- **Framework**: Playwright + Cucumber + TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
npx playwright install
```

### Run Tests
```bash
# All automated tests
npm run test:automated

# By module
npm run test:auth          # Authentication tests
npm run test:registration  # Registration tests  
npm run test:accounts      # Account management tests
npm run test:transactions  # Transaction tests
npm run test:api          # API tests

# By priority
npm run test:smoke        # Smoke tests only
npm run test:critical     # Critical tests only

# Generate HTML report
npm run test:report
```

## 📁 Project Structure

```
parabank-bdd-automation/
├── features/                    # Gherkin feature files
│   ├── authentication.feature  # TC_001-TC_035
│   ├── registration.feature    # TC_036-TC_060
│   ├── accounts.feature        # TC_061-TC_100
│   ├── transactions.feature    # TC_101-TC_155
│   └── api.feature             # TC_176-TC_200
├── src/
│   ├── pages/                  # Page Object Model
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── RegistrationPage.ts
│   │   ├── AccountsPage.ts
│   │   └── TransferPage.ts
│   ├── steps/                  # Cucumber step definitions
│   │   ├── AuthenticationSteps.ts
│   │   ├── RegistrationSteps.ts
│   │   ├── AccountSteps.ts
│   │   ├── TransactionSteps.ts
│   │   └── ApiSteps.ts
│   ├── support/                # Test support utilities
│   │   ├── world.ts           # Cucumber World
│   │   ├── hooks.ts           # Before/After hooks
│   │   ├── config.ts          # Configuration
│   │   └── utils/             # Helper utilities
│   └── fixtures/               # Test data
│       ├── users.json
│       ├── accounts.json
│       └── transactions.json
├── reports/                    # Test execution reports
└── TestDocumentation/         # Original ISTQB documentation
```

## 🏷️ Test Tags

- **@automated** - Automated with Playwright
- **@manual** - Manual test procedures
- **@smoke** - Critical smoke tests
- **@critical** - Critical priority
- **@high** - High priority
- **@medium** - Medium priority
- **@low** - Low priority

## 🎯 Test Modules

| Module | Feature File | Test Cases | Automated | Manual |
|--------|-------------|------------|-----------|---------|
| Authentication | authentication.feature | TC_001-TC_035 | 24 | 11 |
| Registration | registration.feature | TC_036-TC_060 | 20 | 5 |
| Accounts | accounts.feature | TC_061-TC_100 | 32 | 8 |
| Transactions | transactions.feature | TC_101-TC_155 | 45 | 10 |
| Search/Reports | search.feature | TC_156-TC_175 | 15 | 5 |
| API Testing | api.feature | TC_176-TC_200 | 25 | 0 |

## 📊 Documentation Alignment

This implementation is directly based on:
- **TCS-PARABANK-001**: Test Case Specification (200 test cases)
- **MTP-PARABANK-002**: Master Test Plan v2.0
- **TM-PARABANK-001**: Traceability Matrix
- **TDMP-PARABANK-001**: Test Data Management Plan

## 🔧 Configuration

Environment variables:
- `HEADLESS=false` - Run tests in headed mode
- `SLOW_MO=1000` - Add delay between actions (ms)
- `BROWSER=firefox` - Use different browser (chromium/firefox/webkit)

## 📈 Reporting

Reports are generated in `reports/` directory:
- `cucumber-report.html` - HTML report with screenshots
- `cucumber-report.json` - JSON report for CI/CD integration

## 🧪 Test Data

Test data is managed according to TDMP-PARABANK-001:
- Standard test users with different profiles
- Security test payloads
- Performance test datasets
- API test data collections

## 🚀 CI/CD Integration

Ready for integration with:
- GitHub Actions
- Jenkins
- Azure DevOps
- Any CI/CD supporting Node.js and Cucumber JSON reports
