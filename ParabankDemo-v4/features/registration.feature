Feature: Customer Registration Journeys

  Background:
    Given user is on the registration page

  @smoke @registration
  Scenario: Customer creates an account with valid data
    When user registers with default data
    Then registration should succeed

  @regression @validation
  Scenario: Registration fails when passwords do not match
    When user registers with the following details:
      | password         | SecurePass123! |
      | confirm password | WrongPass999!  |
    Then registration should fail with validation message "Passwords did not match."

  @regression @validation
  Scenario: Registration fails when username is missing
    When user registers with the following details:
      | username         |                |
      | password         | SomePass123!   |
      | confirm password | SomePass123!   |
    Then registration should fail with validation message "Username is required."

  @regression @validation
  Scenario: Registration fails when password is missing
    When user registers with the following details:
      | username         | missingpass    |
      | password         |                |
      | confirm password |                |
    Then registration should fail with validation message "Password is required."
