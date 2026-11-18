Feature: End-to-end Regression Journeys

  @regression
  Scenario Outline: Customer completes transfer and bill payment in one session
    Given user is on the login page
    When user logs in with default credentials
    Then user should be logged in successfully
    And accounts overview should be visible
    When user navigates to the "Transfer Funds" page via the navbar
    And user transfers "<transferAmount>" from account "<fromAccount>" to account "<toAccount>"
    Then the transfer receipt shows "<transferAmount>" from "<fromAccount>" to "<toAccount>"
    When user navigates to the "Bill Pay" page via the navbar
    And user pays a bill with the following details:
      | name          | Water Utility  |
      | address       | 88 River Rd    |
      | city          | Springfield    |
      | state         | IL             |
      | zipcode       | 62701          |
      | phone         | 5553210000     |
      | account       | <payeeAccount> |
      | verifyaccount | <payeeAccount> |
      | amount        | <billAmount>   |
      | fromaccount   | <toAccount>    |
    Then bill payment should be successful
    When user navigates to the "Accounts Overview" page via the navbar
    Then accounts overview should be visible
    When user logs out via the navbar
    Then user should see the login page again

    Examples: Pay the bill from the account that received the transfer
      | fromAccount | toAccount | transferAmount | billAmount | payeeAccount |
      | 54321       | 13344     | 25.00          | 40.00      | 223344       |

  @regression @registration
  Scenario: Registration validation prevents mismatched passwords
    Given user is on the registration page
    When user registers with the following details:
      | password         | SecurePass123! |
      | confirm password | WrongPass999!  |
    Then registration should fail with validation message "Passwords did not match."
