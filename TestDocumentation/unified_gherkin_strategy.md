# Unified Gherkin Strategy
## Все 200 тест-кейсов как BDD scenarios для полной согласованности

---

## 🎯 Концепция: ONE FORMAT, TWO EXECUTION TYPES

### Brilliant Approach:
**Все 200 тест-кейсов** → **200 Gherkin scenarios** → **200 step definitions**

```
TC_001 → Gherkin Scenario → @automated step definition (Playwright)
TC_025 → Gherkin Scenario → @manual step definition (Procedure)
```

**Result**: Copilot видит **unified context** и генерирует **consistent step definitions**!

---

## 📋 Reference File for Copilot Context

### reference/complete-test-scenarios.feature
**ALL 200 scenarios in one place for Copilot reference:**

```gherkin
# ParaBank Complete Test Scenarios
# ALL 200 test cases from TCS-PARABANK-001 as Gherkin
# Copilot will use this for step definition generation

Feature: ParaBank Banking Application Testing
  Complete test coverage with automated and manual execution

  Background:
    Given ParaBank application is accessible at "https://parabank.parasoft.com/parabank"
    And test environment is prepared according to TPS-PARABANK-001
    And test data is loaded according to TDMP-PARABANK-001

  # ===== AUTHENTICATION MODULE =====
  # TC_001-TC_035: 24 automated + 11 manual

  @automated @smoke @critical @TC_001
  Scenario: TC_001 - Successful login with valid credentials
    Given I navigate to ParaBank homepage
    When I login with username "john" and password "demo"
    Then I should be redirected to accounts overview page
    And I should see welcome message containing "John Smith"
    And main navigation menu should be visible

  @automated @negative @high @TC_004  
  Scenario: TC_004 - Login fails with invalid username
    Given I navigate to ParaBank homepage
    When I attempt to login with "wronguser" and "demo"
    Then I should see error message "Please enter a valid username and password"
    And I should remain on login page
    And login form should still be visible

  @automated @security @critical @TC_016
  Scenario: TC_016 - SQL injection prevention
    Given I navigate to ParaBank homepage
    When I attempt to login with SQL injection payload "' OR '1'='1" and "' OR '1'='1"
    Then I should see error message "Please enter a valid username and password"
    And no unauthorized access should be granted
    And system security should be maintained

  @automated @browser @compatibility @TC_021
  Scenario: TC_021 - Chrome browser compatibility
    Given I open Chrome browser
    When I test all login functions in Chrome
    Then all features should work correctly
    And UI should display properly in Chrome

  @manual @security @penetration @TC_025
  Scenario: TC_025 - Advanced security penetration testing
    Given I have OWASP ZAP and Burp Suite tools ready
    When I perform comprehensive penetration testing on login module
    Then I should identify any security vulnerabilities
    And I should document findings in security report
    And I should provide remediation recommendations
    # MANUAL EXECUTION: Detailed security analysis procedure

  @manual @accessibility @wcag @TC_026  
  Scenario: TC_026 - Login accessibility compliance
    Given I have NVDA screen reader installed
    When I navigate login form using only keyboard
    And I test login form with screen reader
    Then all form elements should be accessible via keyboard
    And screen reader should announce all elements correctly
    And form should comply with WCAG 2.1 guidelines
    # MANUAL EXECUTION: Accessibility evaluation checklist

  # ===== REGISTRATION MODULE =====
  # TC_036-TC_060: 20 automated + 5 manual

  @automated @smoke @critical @TC_036
  Scenario: TC_036 - Successful user registration
    Given I navigate to ParaBank registration page
    When I fill registration form with valid data:
      | firstName | Jane |
      | lastName | Doe |
      | address | 123 Main Street |
      | city | New York |
      | state | NY |
      | zipCode | 12345 |
      | phone | 555-123-4567 |
      | ssn | 123-45-6789 |
      | username | janedoe2025 |
      | password | SecurePass123! |
    And I submit registration form
    Then registration should complete successfully
    And I should be able to login with new account

  @automated @validation @negative @TC_039
  Scenario: TC_039 - Registration with empty first name
    Given I navigate to ParaBank registration page
    When I fill registration form with empty first name
    And I submit registration form
    Then I should see validation error "First name is required"
    And registration should not complete

  @manual @ux @design @TC_049
  Scenario: TC_049 - Registration form user experience evaluation
    Given I navigate to ParaBank registration page
    When I evaluate registration form design and usability
    Then form layout should be logical and intuitive
    And field labels should be clear and helpful
    And validation messages should guide user properly
    And overall experience should be user-friendly
    # MANUAL EXECUTION: UX evaluation checklist and scoring

  # ===== ACCOUNT MANAGEMENT =====
  # TC_061-TC_100: 32 automated + 8 manual

  @automated @smoke @critical @TC_061
  Scenario: TC_061 - View accounts overview
    Given I am logged in as user "john" with multiple accounts
    When I navigate to accounts overview page
    Then I should see all my accounts listed
    And account balances should be displayed in currency format
    And account types should be clearly indicated

  @automated @critical @TC_076
  Scenario: TC_076 - Open new checking account
    Given I am logged in with account having sufficient funds
    When I navigate to "Open New Account" page
    And I select "Checking" account type
    And I select funding account with $500+ balance
    And I click "Open New Account" button
    Then new checking account should be created successfully
    And account should appear in accounts overview

  @manual @visual @layout @TC_091
  Scenario: TC_091 - Account details visual validation
    Given I am viewing account details page
    When I examine account information layout and presentation
    Then account information should be clearly organized
    And visual hierarchy should guide user attention properly
    And all data should be easily readable
    # MANUAL EXECUTION: Visual design evaluation criteria

  # ===== TRANSACTION PROCESSING =====
  # TC_101-TC_155: 45 automated + 10 manual

  @automated @smoke @critical @TC_101
  Scenario: TC_101 - Transfer funds between accounts
    Given I am logged in with multiple accounts
    And source account has balance of $500+
    When I navigate to "Transfer Funds" page
    And I enter transfer amount "$100.00"
    And I select source and destination accounts
    And I click "Transfer" button
    Then transfer should complete successfully
    And balances should be updated correctly

  @automated @negative @critical @TC_106
  Scenario: TC_106 - Transfer with insufficient funds
    Given I am logged in with account having $50 balance
    When I attempt to transfer $100 from this account
    Then I should see "Insufficient funds" error message
    And transfer should not be processed
    And account balances should remain unchanged

  @manual @workflow @complex @TC_141
  Scenario: TC_141 - Complex multi-step transaction workflow
    Given I need to perform complex transaction sequence
    When I execute multiple related transactions in sequence
    Then each transaction should maintain data consistency
    And overall workflow should be logical and efficient
    And error recovery should work if any step fails
    # MANUAL EXECUTION: Complex workflow evaluation procedure

  # ===== API TESTING =====
  # TC_176-TC_200: 25 automated + 0 manual

  @automated @api @integration @TC_176
  Scenario: TC_176 - Get customer information via API
    Given ParaBank REST API is accessible
    When I send GET request to "/customers/12212"
    Then I should receive HTTP 200 status code
    And response should contain customer information
    And data should match UI display

  @automated @api @critical @TC_189
  Scenario: TC_189 - Transfer funds via API
    Given I have valid customer with multiple accounts
    When I send POST request to "/transfer" with transfer data
    Then I should receive successful response
    And transfer should be reflected in account balances
    And transaction should appear in transaction history
```

---

## 🤖 Copilot Implementation Strategy

### Step Definition Generation Pattern:

#### Automated Steps → Playwright Code
```typescript
// Copilot sees @automated tag and generates implementation
@When('I login with username {string} and password {string}')
async function loginWithCredentials(username: string, password: string) {
  await loginPage.enterUsername(username);
  await loginPage.enterPassword(password);
  await loginPage.clickLoginButton();
}

@Then('I should see error message {string}')
async function verifyErrorMessage(expectedMessage: string) {
  const actualMessage = await loginPage.getErrorMessage();
  expect(actualMessage).toContain(expectedMessage);
}
```

#### Manual Steps → Procedure Documentation  
```typescript
// Copilot sees @manual tag and generates procedure
@When('I perform advanced security penetration testing')
async function performPenetrationTesting() {
  /**
   * MANUAL EXECUTION PROCEDURE (from TPS-PARABANK-001):
   * 
   * 1. Setup Tools:
   *    - Install OWASP ZAP
   *    - Configure proxy settings (127.0.0.1:8080)
   *    - Import ParaBank target configuration
   * 
   * 2. Automated Scan:
   *    - Run spider against https://parabank.parasoft.com/parabank
   *    - Execute active scan on all discovered pages
   *    - Review automated findings
   * 
   * 3. Manual Testing:
   *    - Test for business logic vulnerabilities
   *    - Check for authorization bypasses
   *    - Validate session management
   *    - Test file upload functionality
   * 
   * 4. Documentation:
   *    - Screenshot all findings
   *    - Categorize by severity (Critical/High/Medium/Low)
   *    - Provide remediation steps
   *    - Create executive summary
   * 
   * Expected Time: 4-6 hours
   * Skills Required: Security testing experience
   * Tools Required: OWASP ZAP, Burp Suite, browser dev tools
   */
  
  Logger.info('MANUAL TEST PROCEDURE: Advanced penetration testing');
  
  // Log manual test initiation
  await this.manualTestLogger.logManualTest({
    testId: 'TC_025',
    procedure: 'Advanced security penetration testing',
    estimatedTime: '4-6 hours',
    requiredSkills: ['Security testing', 'OWASP methodology'],
    requiredTools: ['OWASP ZAP', 'Burp Suite'],
    status: 'READY_FOR_MANUAL_EXECUTION'
  });
}
```

---

## 📊 Unified Reporting

### Both Auto and Manual Tests in Same Report:

```html
ParaBank Test Execution Report
=============================

Authentication Module:
✅ TC_001 (automated) - PASSED - 2.3s
✅ TC_004 (automated) - PASSED - 1.8s  
✅ TC_016 (automated) - PASSED - 2.1s
📋 TC_025 (manual) - PROCEDURE_DOCUMENTED - Manual execution required
📋 TC_026 (manual) - PROCEDURE_DOCUMENTED - Manual execution required

Total: 160 automated (executed) + 40 manual (procedures ready)
```

---

## 🔧 Implementation Commands

### VS Code File Creation:
```bash
# 1. Create complete scenario file
touch features/complete-parabank-suite.feature

# 2. Create reference for Copilot  
touch reference/scenarios-by-module.md
touch reference/step-patterns.md

# 3. Generate step definitions with Agent
# @workspace Create step definitions for all scenarios in features/complete-parabank-suite.feature
# Include both automated (Playwright) and manual (procedure) implementations
```

### Copilot Context Setup:
**Open these files simultaneously in VS Code:**
- `features/complete-parabank-suite.feature` (all scenarios)
- `reference/step-patterns.md` (implementation patterns)
- `src/pages/LoginPage.ts` (page object being developed)

**Copilot will automatically understand:**
- Which scenarios need automation
- Which scenarios need manual procedures  
- How to implement each step type
- Test data requirements

---

## 🎪 Perfect Alignment Achievement

### Documentation → Code Traceability:
```
ISTQB Doc TCS-PARABANK-001 TC_001
    ↓
Gherkin Scenario @TC_001
    ↓  
Step Definition (automated)
    ↓
LoginPage.login() method
    ↓
Test Execution Result
```

### Manual Test Integration:
```
ISTQB Doc TPS-PARABANK-001 Manual Procedure
    ↓
Gherkin Scenario @manual @TC_025
    ↓
Step Definition (manual procedure)
    ↓
Manual Test Documentation
    ↓
Manual Execution Checklist
```

**Хотите, создам полный Gherkin suite для всех 200 тест-кейсов прямо сейчас?** Это будет **foundation file** для VS Code Copilot! 🚀

Или сначала создам **pattern examples** - как должны выглядеть automated vs manual step definitions?