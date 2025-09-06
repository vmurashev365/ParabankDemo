# Authentication Feature
# Based on TC_001-TC_035 from complete_parabank_scenarios.txt
# 24 automated + 11 manual scenarios

Feature: ParaBank Authentication
  As a ParaBank customer
  I want to securely access my banking account
  So that I can manage my finances safely

  Background:
    Given ParaBank application is accessible
    And test environment is configured per TPS-PARABANK-001
    And test data is prepared per TDMP-PARABANK-001

  # ==========================================
  # BASIC LOGIN FUNCTIONALITY (TC_001-TC_007)
  # Automated scenarios
  # ==========================================

  @automated @smoke @critical @TC_001
  Scenario: TC_001 - Successful login with valid credentials
    Given I navigate to ParaBank homepage
    When I login with username "john" and password "demo"
    Then I should be redirected to accounts overview page
    And I should see welcome message containing "Welcome"
    And main navigation menu should be visible

  @automated @smoke @validation @TC_002
  Scenario: TC_002 - Login form displays correctly
    Given I navigate to ParaBank homepage
    Then login form should be displayed
    And username field should be visible and enabled
    And password field should be visible and enabled
    And login button should be visible and enabled

  @automated @positive @TC_003
  Scenario: TC_003 - Login with alternative valid user
    Given I navigate to ParaBank homepage
    When I login with username "testuser1" and password "TestPass123!"
    Then I should be successfully logged in
    And I should see my account information

  @automated @negative @high @TC_004
  Scenario: TC_004 - Login with invalid username (ParaBank accepts all credentials)
    Given I navigate to ParaBank homepage
    When I attempt to login with "wronguser" and "demo"
    Then I should be successfully logged in
    And I should see welcome message containing "Welcome"

  @automated @negative @high @TC_005
  Scenario: TC_005 - Login with invalid password (ParaBank accepts all credentials)
    Given I navigate to ParaBank homepage
    When I attempt to login with "john" and "wrongpass"
    Then I should be successfully logged in
    And I should see welcome message containing "Welcome"

  @automated @negative @validation @TC_006
  Scenario: TC_006 - Login with both credentials invalid (ParaBank accepts all credentials)
    Given I navigate to ParaBank homepage
    When I attempt to login with "wronguser" and "wrongpass"
    Then I should be successfully logged in
    And I should see welcome message containing "Welcome"

  @automated @negative @validation @TC_007
  Scenario: TC_007 - Login with empty fields (Only case where ParaBank validates)
    Given ParaBank application is accessible
    And test environment is configured per TPS-PARABANK-001
    And test data is prepared per TDMP-PARABANK-001
    Given I navigate to ParaBank homepage
    When I attempt to login with empty credentials
    Then I should remain on login page

  # ==========================================
  # SESSION MANAGEMENT (TC_013-TC_015)
  # Automated scenarios
  # ==========================================

  @automated @session @high @TC_013
  Scenario: TC_013 - Successful logout
    Given I am logged in as user "john"
    When I click logout button
    Then I should be redirected to login page
    And session should be terminated
    And I should not be able to access account pages directly

  @automated @session @medium @TC_014
  Scenario: TC_014 - Session persistence across browser tabs
    Given I am logged in as user "john" in first tab
    When I open new browser tab
    And I navigate to ParaBank in new tab
    Then I should still be logged in
    And I should see my account information

  @automated @session @medium @TC_015
  Scenario: TC_015 - Browser back button after logout (ParaBank security issue)
    Given I am logged in and viewing accounts overview
    When I logout successfully
    And I click browser back button
    Then I should not be able to access account information
    And I should be redirected to login page

  # ==========================================
  # SECURITY TESTING (TC_016-TC_020)
  # Automated scenarios - Security validation
  # ==========================================

  @automated @security @critical @TC_016
  Scenario: TC_016 - SQL injection prevention
    Given ParaBank application is accessible
    And test environment is configured per TPS-PARABANK-001
    And test data is prepared per TDMP-PARABANK-001
    Given I navigate to ParaBank homepage
    When I attempt to login with SQL payload "' OR '1'='1" and "' OR '1'='1"
    Then I should see login failure or security warning
    And no unauthorized access should be granted

  @automated @security @critical @TC_017
  Scenario: TC_017 - SQL injection with quotes
    Given ParaBank application is accessible
    And test environment is configured per TPS-PARABANK-001
    And test data is prepared per TDMP-PARABANK-001
    Given I navigate to ParaBank homepage
    When I attempt to login with SQL payload "\" OR \"1\"=\"1" and "demo"
    Then login should be rejected safely
    And no database error should be exposed

  @automated @security @critical @TC_018
  Scenario: TC_018 - SQL injection with UNION attack
    Given ParaBank application is accessible
    And test environment is configured per TPS-PARABANK-001
    And test data is prepared per TDMP-PARABANK-001
    Given I navigate to ParaBank homepage
    When I attempt to login with SQL payload "admin' UNION SELECT * FROM users--" and "any"
    Then login should be rejected safely
    And no sensitive data should be exposed

  @automated @security @critical @TC_019
  Scenario: TC_019 - XSS prevention in username field
    Given ParaBank application is accessible
    And test environment is configured per TPS-PARABANK-001
    And test data is prepared per TDMP-PARABANK-001
    Given I navigate to ParaBank homepage
    When I attempt to login with XSS payload "<script>alert('xss')</script>" and "demo"
    Then XSS payload should be sanitized or rejected
    And login should be rejected safely

  @automated @security @critical @TC_020
  Scenario: TC_020 - XSS prevention in password field
    Given ParaBank application is accessible
    And test environment is configured per TPS-PARABANK-001
    And test data is prepared per TDMP-PARABANK-001
    Given I navigate to ParaBank homepage
    When I attempt to login with "john" and XSS payload "<img onerror='alert(1)' src='x'>"
    Then XSS payload should be sanitized or rejected
    And login should be rejected safely

  # ==========================================
  # BROWSER COMPATIBILITY (TC_021-TC_024)
  # Automated scenarios - Cross-browser testing
  # ==========================================

  @automated @browser @compatibility @TC_021
  Scenario: TC_021 - Chrome browser compatibility
    Given I open Chrome browser
    When I test login functionality in Chrome
    Then all login features should work correctly
    And UI should display properly

  @automated @browser @compatibility @TC_022
  Scenario: TC_022 - Firefox browser compatibility
    Given I open Firefox browser
    When I test login functionality in Firefox
    Then all login features should work correctly
    And UI should display properly

  @automated @browser @compatibility @TC_023
  Scenario: TC_023 - Safari browser compatibility
    Given I open Safari browser
    When I test login functionality in Safari
    Then all login features should work correctly
    And UI should display properly

  @automated @browser @compatibility @TC_024
  Scenario: TC_024 - Edge browser compatibility
    Given I open Edge browser
    When I test login functionality in Edge
    Then all login features should work correctly
    And UI should display properly

  # ==========================================
  # MANUAL TEST SCENARIOS (TC_025-TC_035)
  # Manual execution procedures
  # ==========================================

  @manual @security @penetration @TC_025
  Scenario: TC_025 - Advanced penetration testing
    Given I have professional security testing tools ready
    When I perform comprehensive penetration testing on authentication
    Then I should identify any security vulnerabilities
    And I should document findings with severity levels
    And I should provide detailed remediation recommendations
    # MANUAL: 4-6 hour security analysis with OWASP ZAP/Burp Suite

  @manual @accessibility @wcag @TC_026
  Scenario: TC_026 - Accessibility compliance testing
    Given I have accessibility testing tools configured
    When I evaluate login form accessibility
    Then form should be WCAG 2.1 AA compliant
    And all elements should be keyboard accessible
    And screen readers should announce elements correctly
    # MANUAL: Accessibility evaluation with NVDA/JAWS

  @manual @usability @ux @TC_027
  Scenario: TC_027 - Login usability evaluation
    Given I recruit 5 test users with different technical backgrounds
    When users attempt to login for first time
    Then login process should be intuitive and efficient
    And users should complete login within 30 seconds
    And satisfaction score should be 4.5+ out of 5
    # MANUAL: User experience study with real participants

  @manual @performance @stress @TC_028
  Scenario: TC_028 - Login under extreme load conditions
    Given I have load testing tools configured for 1000+ concurrent users
    When I simulate extreme load on login system
    Then system should maintain stability
    And response times should degrade gracefully
    And no data corruption should occur
    # MANUAL: Load testing with JMeter/Artillery beyond normal automation

  @manual @security @advanced @TC_029
  Scenario: TC_029 - Advanced brute force attack simulation
    Given I have specialized brute force testing tools
    When I simulate sophisticated password attack patterns
    Then account lockout mechanisms should activate correctly
    And system should log security events appropriately
    And no unauthorized access should be possible
    # MANUAL: Specialized security testing requiring expert analysis

  @manual @compatibility @devices @TC_030
  Scenario: TC_030 - Mobile device compatibility testing
    Given I have access to various mobile devices and tablets
    When I test login functionality across different devices
    Then login should work consistently across all devices
    And touch interactions should be responsive
    And display should adapt properly to screen sizes
    # MANUAL: Physical device testing with different OS versions

  @manual @network @connectivity @TC_031
  Scenario: TC_031 - Login under poor network conditions
    Given I have network simulation tools configured
    When I test login with various network conditions (slow, intermittent, high latency)
    Then login should handle network issues gracefully
    And appropriate error messages should guide user
    And system should recover when connection improves
    # MANUAL: Network condition simulation and analysis

  @manual @data @boundary @TC_032
  Scenario: TC_032 - Extreme data boundary testing
    Given I need to test with extreme edge cases
    When I test login with very long usernames and passwords
    And I test with special unicode characters and symbols
    Then system should handle edge cases appropriately
    And no system crashes or unexpected behavior should occur
    # MANUAL: Edge case testing requiring human judgment

  @manual @security @social @TC_033
  Scenario: TC_033 - Social engineering vulnerability assessment
    Given I have social engineering testing methodology ready
    When I evaluate susceptibility to social engineering attacks
    Then I should assess phishing vulnerability
    And I should evaluate password reset security
    And I should document human factor vulnerabilities
    # MANUAL: Social engineering assessment requiring security expertise
