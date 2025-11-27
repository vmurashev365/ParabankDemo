Feature: Essential Smoke Coverage

  @smoke @critical
  Scenario: Customer signs in and sees account overview
    Given user is on the login page
    When user logs in with default credentials
    Then user should be logged in successfully
    And accounts overview should be visible

  @smoke @transfers
  Scenario: Customer can submit a quick transfer
    Given user is on the transfer page
    When user transfers "50.00" between accounts
    Then transfer should be successful

  @smoke @billpay
  Scenario: Customer pays a standard utility bill
    Given user is on the bill pay page
    When user pays a bill with the following details:
      | name          | City Utilities |
      | address       | 77 River Row   |
      | city          | Auburn         |
      | state         | WA             |
      | zipcode       | 98001          |
      | phone         | 5552228888     |
      | account       | 220011         |
      | verifyaccount | 220011         |
      | amount        | 25.00          |
      | fromaccount   | 13344          |
    Then bill payment should be successful
