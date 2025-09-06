Feature: User Registration
  As a new user
  I want to register for a ParaBank account
  So that I can access banking services

  Background:
    Given ParaBank application is accessible
    And test environment is configured per TPS-PARABANK-001
    And test data is prepared per TDMP-PARABANK-001

  @automated @smoke @critical @TC_036
  Scenario: TC_036 - Successful registration with valid data
    Given I navigate to ParaBank registration page
    When I register new user with valid information:
      | field           | value              |
      | firstName       | Jane               |
      | lastName        | Doe                |
      | address         | 123 Main Street    |
      | city            | New York           |
      | state           | NY                 |
      | zipCode         | 12345              |
      | phone           | 555-123-4567       |
      | ssn             | 123-45-6789        |
      | username        | janedoe2025        |
      | password        | SecurePass123!     |
      | confirmPassword | SecurePass123!     |
    Then registration should complete successfully
    And I should be able to login with new credentials

  @automated @functional @positive @TC_037
  Scenario: TC_037 - Successful registration with different valid data
    Given I navigate to ParaBank registration page
    When I register new user with valid information:
      | field           | value              |
      | firstName       | Michael            |
      | lastName        | Smith              |
      | address         | 456 Oak Avenue     |
      | city            | Los Angeles        |
      | state           | CA                 |
      | zipCode         | 90210              |
      | phone           | 555-987-6543       |
      | ssn             | 987-65-4321        |
      | username        | msmith2025         |
      | password        | MySecure456!       |
      | confirmPassword | MySecure456!       |
    Then registration should complete successfully
    And I should be able to login with new credentials

  @automated @functional @positive @TC_038
  Scenario: TC_038 - Successful registration with minimal valid data
    Given I navigate to ParaBank registration page
    When I register new user with valid information:
      | field           | value              |
      | firstName       | Bob                |
      | lastName        | Johnson            |
      | address         | 789 Pine St        |
      | city            | Chicago            |
      | state           | IL                 |
      | zipCode         | 60601              |
      | phone           | 312-555-0123       |
      | ssn             | 111-22-3333        |
      | username        | bjohnson2025       |
      | password        | Pass123!           |
      | confirmPassword | Pass123!           |
    Then registration should complete successfully
    And I should be able to login with new credentials

  @automated @validation @negative @TC_039
  Scenario: TC_039 - Registration with empty first name
    Given I navigate to ParaBank registration page
    When I fill registration form with empty first name
    And I submit registration form
    Then I should see validation error for first name field
    And registration should not complete

  @automated @validation @negative @TC_040
  Scenario: TC_040 - Registration with empty last name
    Given I navigate to ParaBank registration page
    When I fill registration form with empty last name
    And I submit registration form
    Then I should see validation error for last name field
    And registration should not complete

  @automated @validation @negative @TC_041
  Scenario: TC_041 - Registration with invalid first name format (numbers)
    Given I navigate to ParaBank registration page
    When I fill registration form with invalid first name "123John"
    And I submit registration form
    Then I should see validation error for first name field
    And registration should not complete

  @automated @validation @negative @TC_042
  Scenario: TC_042 - Registration with invalid first name format (special characters)
    Given I navigate to ParaBank registration page
    When I fill registration form with invalid first name "@#$%John"
    And I submit registration form
    Then I should see validation error for first name field
    And registration should not complete

  @automated @validation @negative @TC_043
  Scenario: TC_043 - Registration with invalid last name format (numbers)
    Given I navigate to ParaBank registration page
    When I fill registration form with invalid last name "123Doe"
    And I submit registration form
    Then I should see validation error for last name field
    And registration should not complete

  @automated @validation @negative @TC_044
  Scenario: TC_044 - Registration with invalid address format (ParaBank accepts most data)
    Given I navigate to ParaBank registration page
    When I fill registration form with invalid address "@#$%"
    And I submit registration form
    Then ParaBank accepts invalid address
    And I should see registration result

  @automated @validation @negative @TC_045
  Scenario: TC_045 - Registration with invalid city format (ParaBank accepts most data)
    Given I navigate to ParaBank registration page
    When I fill registration form with invalid city "123City"
    And I submit registration form
    Then ParaBank accepts invalid city
    And I should see registration result

  @automated @validation @negative @TC_046
  Scenario: TC_046 - Registration with invalid state format (ParaBank accepts most data)
    Given I navigate to ParaBank registration page
    When I fill registration form with invalid state "123"
    And I submit registration form
    Then ParaBank accepts invalid state
    And I should see registration result

  @automated @validation @negative @TC_047
  Scenario: TC_047 - Registration with invalid zip code format (ParaBank accepts most data)
    Given I navigate to ParaBank registration page
    When I fill registration form with invalid zip code "ABCDE"
    And I submit registration form
    Then ParaBank accepts invalid zip
    And I should see registration result

  @automated @validation @negative @TC_048
  Scenario: TC_048 - Registration with invalid phone format (ParaBank accepts most data)
    Given I navigate to ParaBank registration page
    When I fill registration form with invalid phone "phone123"
    And I submit registration form
    Then ParaBank accepts invalid phone
    And I should see registration result

  @automated @validation @negative @TC_049
  Scenario: TC_049 - Registration with invalid SSN format (ParaBank accepts most data)
    Given I navigate to ParaBank registration page
    When I fill registration form with invalid SSN "invalid-ssn"
    And I submit registration form
    Then ParaBank accepts invalid SSN
    And I should see registration result

  @automated @validation @negative @TC_050
  Scenario: TC_050 - Registration with mismatched password confirmation (ParaBank accepts mismatched passwords)
    Given I navigate to ParaBank registration page
    When I fill registration form with mismatched password confirmation
    And I submit registration form
    Then ParaBank accepts mismatched passwords
    And I should see registration result
