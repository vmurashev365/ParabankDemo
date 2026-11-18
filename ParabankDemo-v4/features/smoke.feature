Feature: Essential Smoke Coverage

  @smoke @critical
  Scenario: Customer signs in and sees account overview
    Given user is on the login page
    When user logs in with default credentials
    Then user should be logged in successfully
    And accounts overview should be visible

  @smoke @transfers
  Scenario Outline: Customer can submit a quick transfer
    Given user is on the transfer page
    When user transfers "<amount>" from account "<fromAccount>" to account "<toAccount>"
    Then the transfer receipt shows "<amount>" from "<fromAccount>" to "<toAccount>"

    Examples: Checking to savings
      | fromAccount | toAccount | amount |
      | 54321       | 13344     | 50.00  |

  @smoke @billpay
  Scenario Outline: Customer pays a standard utility bill
    Given user is on the bill pay page
    When user pays a bill with the following details:
      | name          | City Utilities   |
      | address       | 77 River Row     |
      | city          | Auburn           |
      | state         | WA               |
      | zipcode       | 98001            |
      | phone         | 5552228888       |
      | account       | <payeeAccount>   |
      | verifyaccount | <payeeAccount>   |
      | amount        | <billAmount>     |
      | fromaccount   | <fundingAccount> |
    Then bill payment should be successful

    Examples: Utility payment from savings
      | fundingAccount | billAmount | payeeAccount |
      | 13344          | 25.00      | 220011       |
