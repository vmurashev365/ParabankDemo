Feature: Bill Payment Workflows

  Background:
    Given user is on the bill pay page

  @regression @billpay
  Scenario: Pay a monthly utility bill from checking
    Given user opens the accounts overview
    And the customer records the balance of account "54321"
    When user navigates to the "Bill Pay" page via the navbar
    And user pays a bill with the following details:
      | name          | Electric Company |
      | address       | 123 Grid St      |
      | city          | Metropolis       |
      | state         | NY               |
      | zipcode       | 10001            |
      | phone         | 5551237890       |
      | account       | 445566           |
      | verifyaccount | 445566           |
      | amount        | 75.50            |
      | fromaccount   | 54321            |
    Then bill payment should be successful
    When user returns to the accounts overview
    Then account "54321" has a balance change of "-75.50" USD
    And the banking API balance of account "54321" matches the UI balance
    And the banking API ledger for account "54321" records a "Debit" transaction of "75.50" USD mentioning "Electric Company"

  @regression @billpay
  Scenario: Pay a rent bill from savings
    Given user opens the accounts overview
    And the customer records the balance of account "13344"
    When user navigates to the "Bill Pay" page via the navbar
    And user pays a bill with the following details:
      | name          | Landlord LLC |
      | address       | 42 Main St   |
      | city          | Springfield  |
      | state         | IL           |
      | zipcode       | 62701        |
      | phone         | 5550001111   |
      | account       | 777888       |
      | verifyaccount | 777888       |
      | amount        | 1200.00      |
      | fromaccount   | 13344        |
    Then bill payment should be successful
    When user returns to the accounts overview
    Then account "13344" has a balance change of "-1200.00" USD
    And the banking API balance of account "13344" matches the UI balance
    And the banking API ledger for account "13344" records a "Debit" transaction of "1200.00" USD mentioning "Landlord LLC"

  @regression @negative @billpay
  Scenario: Bill payment requires an amount
    When user pays a bill with the following details:
      | name          | Cable Provider |
      | address       | 1 Fiber Way    |
      | city          | Gotham         |
      | state         | NJ             |
      | zipcode       | 07001          |
      | phone         | 5551112233     |
      | account       | 998877         |
      | verifyaccount | 998877         |
      | amount        |                |
      | fromaccount   | 13344          |
    Then bill payment should fail with message "The amount cannot be empty."

  @regression @negative @billpay
  Scenario: Bill payment fails when payee name is missing
    When user pays a bill with the following details:
      | name          |            |
      | address       | 500 Elm St |
      | city          | Star City  |
      | state         | CA         |
      | zipcode       | 90001      |
      | phone         | 5552223344 |
      | account       | 333222     |
      | verifyaccount | 333222     |
      | amount        | 15.00      |
      | fromaccount   | 13344      |
    Then bill payment should fail with message "Payee name is required."

  @regression @negative @billpay
  Scenario: A mismatched payee account confirmation leaves the customer's balance unchanged
    Given user opens the accounts overview
    And the customer records the balance of account "13344"
    When user navigates to the "Bill Pay" page via the navbar
    And user pays a bill with the following details:
      | name          | Water Utility |
      | account       | 445566        |
      | verifyaccount | 445567        |
      | amount        | 19.99         |
      | fromaccount   | 13344         |
    Then bill payment should fail with message "The account numbers do not match."
    When user returns to the accounts overview
    Then account "13344" has a balance change of "0.00" USD
    And the banking API balance of account "13344" matches the UI balance
