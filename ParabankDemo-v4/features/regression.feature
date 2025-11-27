Feature: End-to-end Regression Journeys

  @regression
  Scenario: Customer completes transfer and bill payment in one session
    Given user is on the login page
    When user logs in with default credentials
    Then user should be logged in successfully
    And accounts overview should be visible
    When user navigates to the "Transfer Funds" page via the navbar
    And user transfers "25.00" between accounts
    Then transfer should be successful
    When user navigates to the "Bill Pay" page via the navbar
    And user pays a bill with the following details:
      | name          | Water Utility |
      | address       | 88 River Rd   |
      | city          | Springfield   |
      | state         | IL            |
      | zipcode       | 62701         |
      | phone         | 5553210000    |
      | account       | 223344        |
      | verifyaccount | 223344        |
      | amount        | 40.00         |
      | fromaccount   | 13344         |
    Then bill payment should be successful
    When user navigates to the "Accounts Overview" page via the navbar
    Then accounts overview should be visible
    When user logs out via the navbar
    Then user should see the login page again

  @regression @registration
  Scenario: Registration validation prevents mismatched passwords
    Given user is on the registration page
    When user registers with the following details:
      | password         | SecurePass123! |
      | confirm password | WrongPass999!  |
    Then registration should fail with validation message "Passwords did not match."
