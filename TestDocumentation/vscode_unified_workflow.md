# VS Code Unified Workflow
## Gherkin-First Development with Automated + Manual Step Definitions

---

## 🎯 Unified Strategy Benefits

### Perfect Alignment Achievement:
```
ISTQB Documentation → Gherkin Scenarios → Step Definitions → Execution
       ↓                      ↓                 ↓              ↓
   200 Test Cases      200 BDD Scenarios    200 Steps    160 Auto + 40 Manual
```

**Copilot Advantage:** Sees **all scenarios together** → generates **consistent step definitions**

---

## 📋 VS Code Setup Commands

### Project Initialization:
```bash
# 1. Create project
mkdir parabank-unified-bdd && cd parabank-unified-bdd && code .

# 2. Initialize and install
npm init -y
npm install --save-dev @playwright/test @cucumber/cucumber @types/node typescript ts-node winston
npm install playwright faker
npx playwright install

# 3. Create unified structure
mkdir -p src/{pages/{base},steps,support/{utils,types,config}}
mkdir -p features/{unified}
mkdir -p test-data/{users,security,performance}
mkdir -p reports/{automated,manual,unified}
mkdir -p reference
```

### Reference Files Setup:
```bash
# Copy our generated files to reference/
# These provide context for Copilot
touch reference/complete-scenarios.feature
touch reference/step-patterns.ts
touch reference/test-data-samples.json
```

---

## 🤖 AI-Assisted Development Workflow

### Day 1: Foundation with Claude + VS Code Setup

#### Morning: Claude Session (здесь)
**Prompt for this chat:**
```
Create foundational classes for unified Gherkin approach:

1. ManualTestLogger.ts - logs manual test procedures
2. TestExecutionTracker.ts - tracks both auto and manual progress  
3. ApiHelper.ts - for API test scenarios
4. World.ts - Cucumber world with both auto/manual support

These should support our unified BDD approach where:
- @automated scenarios → Playwright execution
- @manual scenarios → Documented procedures + tracking
```

#### Afternoon: VS Code Implementation
**Copy files from Claude → VS Code, then:**

**Open these files for Copilot context:**
- `reference/complete-scenarios.feature`
- `reference/step-patterns.ts`
- `src/support/types/TestContext.ts`

**Start typing in new file:**
```typescript
// src/steps/AuthenticationSteps.ts
// Copilot will see scenarios and generate steps

import { Given, When, Then } from '@cucumber/cucumber';
// Copilot suggests appropriate imports

// Start typing step definition - Copilot completes based on scenarios
@Given('I navigate to ParaBank homepage')
async function navigateToHomepage() {
  // Copilot suggests implementation based on step-patterns.ts
```

### Day 2: Authentication Module Implementation

#### Agent Mode Commands:
```
@workspace Create complete authentication test implementation:

Based on reference/complete-scenarios.feature authentication scenarios (TC_001-TC_035):

1. Create src/steps/AuthenticationSteps.ts with step definitions for:
   - @automated scenarios: Playwright implementation
   - @manual scenarios: Procedure documentation

2. Create src/pages/LoginPage.ts with methods supporting all auth scenarios

3. Ensure step definitions match exactly the scenarios in complete-scenarios.feature

Generate both automated execution code and manual procedure documentation.
```

#### Copilot-Assisted Development:
**Start typing each step definition:**
```typescript
// TC_001 scenario implementation
@When('I login with username {string} and password {string}')
async function loginWithCredentials(username: string, password: string) {
  // Copilot suggests: this.loginPage.login(username, password)
  // Based on step-patterns.ts context
```

### Day 3-4: Registration + Accounts Modules

#### Morning Planning with Claude:
```
Create implementation plan for Registration (TC_036-TC_060) and Account Management (TC_061-TC_100) modules:

From our complete-scenarios.feature:
- Registration: 20 automated + 5 manual scenarios
- Accounts: 32 automated + 8 manual scenarios

Need:
1. Page object classes
2. Step definitions (auto + manual)
3. Test data integration
4. Manual procedure documentation
```

#### VS Code Agent Implementation:
```
@workspace Implement registration and account modules:

1. Create RegisterPage.ts supporting scenarios TC_036-TC_048
2. Create AccountsOverviewPage.ts for scenarios TC_061-TC_083  
3. Create step definitions in RegistrationSteps.ts and AccountSteps.ts
4. Include both automated Playwright code and manual procedures
5. Use test data from reference/test-data-samples.json

Base implementation on complete-scenarios.feature scenarios.
```

---

## 🔄 Daily Development Cycle

### Morning: Claude Planning (15 minutes)
**Prompt template:**
```
Today implementing [module] scenarios TC_XXX-TC_YYY:

From complete-scenarios.feature:
- X automated scenarios need Playwright implementation  
- Y manual scenarios need procedure documentation

Create:
1. [PageObject].ts class structure
2. Complex step definition logic
3. Manual procedure templates
4. Integration patterns

Provide code examples and Agent mode prompts.
```

### Day: VS Code Development (6 hours)

#### Hour 1: Page Object Implementation
**Copilot context:** Open complete-scenarios.feature + step-patterns.ts
```typescript
// Start typing - Copilot completes based on scenarios
export class LoginPage extends BasePage {
  // Copilot sees @automated scenarios and suggests methods
  async login(username: string, password: string): Promise<void> {
    // Implementation guided by TC_001 scenario
```

#### Hour 2-4: Step Definitions Generation  
**Agent Mode:**
```
@workspace Generate step definitions for authentication module:
- Read scenarios from reference/complete-scenarios.feature
- Create automated steps with Playwright code for @automated scenarios
- Create manual procedure steps for @manual scenarios  
- Use step-patterns.ts as implementation guide
```

#### Hour 5-6: Testing and Validation
```bash
# Run automated tests
npm run test:auth

# Check manual procedures generated
npm run test:manual-docs

# Verify alignment with documentation
npm run validate:alignment
```

### Evening: Claude Review (15 minutes)
**Return to this chat:**
```
Code review for today's unified BDD implementation:

Generated files:
- [list files created]
- Automated scenarios implemented: TC_XXX, TC_YYY
- Manual procedures documented: TC_ZZZ, TC_AAA

[paste key code sections]

Verify:
- Scenarios match our complete-scenarios.feature exactly?
- Step definitions follow our patterns correctly?
- Manual procedures are detailed enough for execution?
- Framework supports both execution types seamlessly?
```

---

## 📊 Unified Execution and Reporting

### Test Execution Commands:
```bash
# Run all automated tests (160 scenarios)
npm run test:automated

# Generate manual test procedures (40 scenarios)  
npm run generate:manual-procedures

# Run unified test suite (shows both types)
npm run test:unified

# Generate combined report
npm run report:complete
```

### Unified Test Report Output:
```
ParaBank Unified Test Execution Report
=====================================

Total Scenarios: 200
├── Automated: 160 scenarios
│   ├── ✅ Passed: 155 scenarios  
│   ├── ❌ Failed: 5 scenarios
│   └── ⏭️ Skipped: 0 scenarios
└── Manual: 40 scenarios
    ├── 📋 Procedures Ready: 40 scenarios
    ├── ✅ Executed: 25 scenarios
    ├── ⏳ Pending: 15 scenarios
    └── 📝 Results Documented: 25 scenarios

Module Breakdown:
Authentication (35): 24 auto + 11 manual
Registration (25): 20 auto + 5 manual  
Accounts (40): 32 auto + 8 manual
Transactions (55): 45 auto + 10 manual
Search (20): 15 auto + 5 manual
API (25): 25 auto + 0 manual

Coverage: 96% requirements covered (per Traceability Matrix TM-PARABANK-001)
```

---

## 🔧 Copilot Generation Examples

### What Copilot Will Generate:

#### For @automated scenario:
```typescript
@When('I login with username {string} and password {string}')
async function loginWithCredentials(username: string, password: string) {
  // Copilot suggests Playwright implementation
  await this.loginPage.enterUsername(username);
  await this.loginPage.enterPassword(password);
  await this.loginPage.clickLoginButton();
}
```

#### For @manual scenario:
```typescript
@When('I perform comprehensive penetration testing on authentication')
async function performPenetrationTesting() {
  // Copilot suggests manual procedure logging
  await this.manualTestLogger.logManualTestStart({
    testId: 'TC_025',
    procedure: 'Advanced security penetration testing',
    estimatedTime: '4-6 hours',
    requiredTools: ['OWASP ZAP', 'Burp Suite'],
    status: 'READY_FOR_MANUAL_EXECUTION'
  });
  
  /**
   * MANUAL EXECUTION PROCEDURE:
   * [Detailed steps from our TPS-PARABANK-001]
   */
}
```

#### For hybrid scenario:
```typescript
@When('I test all login functions in Chrome')
async function testLoginInChrome() {
  // Automated setup
  await this.loginPage.verifyBrowserCompatibility('Chrome');
  
  // Manual validation flag
  this.testContext.manualValidationRequired.push({
    testId: 'TC_021',
    task: 'Visual Chrome compatibility validation',
    checklist: ['UI rendering', 'Interactions', 'Performance']
  });
}
```

---

## 🎪 Perfect Documentation Alignment

### Traceability Chain:
```
TCS-PARABANK-001 TC_001: Successful Login
    ↓
complete-scenarios.feature @TC_001 scenario  
    ↓
AuthenticationSteps.ts loginWithCredentials()
    ↓
LoginPage.ts login() method
    ↓
Test execution result ✅ PASS
    ↓
Unified report shows TC_001 completed
```

### Manual Test Chain:
```
TPS-PARABANK-001 Manual Procedure TC_025
    ↓  
complete-scenarios.feature @manual @TC_025
    ↓
AuthenticationSteps.ts performPenetrationTesting()
    ↓
Manual test ticket created
    ↓
Human executes procedure
    ↓
Results logged in unified report
```

---

## 🚀 Implementation Commands Summary

### Complete VS Code Workflow:

#### 1. Setup Project:
```bash
# Terminal commands
mkdir parabank-unified-bdd && cd parabank-unified-bdd && code .
npm init -y && npm install [dependencies]
# Copy reference files from Claude chat
```

#### 2. AI-Assisted Development:
```bash
# Agent Mode
@workspace Create unified BDD framework based on reference/complete-scenarios.feature

# Copilot Context  
# Open: complete-scenarios.feature + step-patterns.ts + current file

# Claude Reviews
# Return to chat for architecture decisions and complex implementations
```

#### 3. Daily Testing:
```bash
# Automated execution
npm run test:automated:auth     # TC_001-TC_024 automated
npm run test:automated:all      # All 160 automated scenarios

# Manual procedure generation
npm run generate:manual:auth    # TC_025-TC_035 procedures
npm run generate:manual:all     # All 40 manual procedures

# Unified reporting
npm run report:unified          # Combined auto + manual report
```

**Result:** 🏆 **Perfect alignment** between ISTQB docs and implementation + **impressive portfolio piece** showing modern BDD + AI-assisted development!

**Ready to start with project setup and foundation files?** 🚀