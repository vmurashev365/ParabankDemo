Feature: Authentication and Sessions

  Background:
    Given user is on the login page

  @smoke @critical
  Scenario: Customer signs in with default credentials
    When user logs in with default credentials
    Then user should be logged in successfully

  @regression @positive
  Scenario: Customer signs in with named credentials
    When user logs in as "john" with password "demo"
    Then user should be logged in successfully

  @regression @negative
  Scenario: Login requires non-empty credentials
    When user attempts to login with username "" and password ""
    Then user should remain on the login page

  @regression @negative
  Scenario: Login fails with invalid password
    When user attempts to login with username "john" and password "wrongpass"
    Then user should remain on the login page

  @regression @negative
  Scenario: Login fails with unknown username
    When user attempts to login with username "unknownuser" and password "demo"
    Then user should remain on the login page

  @session @regression
  Scenario: Customer session ends after logout
    Given user has access to the main navigation
    When user logs out via the navbar
    Then user should see the login page again
