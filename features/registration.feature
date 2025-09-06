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
