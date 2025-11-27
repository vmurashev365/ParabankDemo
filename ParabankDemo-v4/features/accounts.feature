Feature: Account Visibility and Navigation

  Background:
    Given user is viewing the accounts overview

  @smoke @accounts
  Scenario: Accounts overview is visible to the customer
    Then accounts overview should be visible

  @regression @accounts
  Scenario: Customer can open a specific account
    When user opens account details for "13344"
    Then account details should be visible

  @regression @validation
  Scenario: Account list shows at least one entry
    When user lists all account summaries
    Then user should see at least 1 accounts listed

  @regression @accounts
  Scenario: Customer navigates back from account details to overview
    When user opens account details for "13344"
    And user returns to the accounts overview
    Then accounts overview should be visible
