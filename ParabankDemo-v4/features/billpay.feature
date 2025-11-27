Feature: Bill Payment Workflows

  Background:
    Given user is on the bill pay page

  @regression @billpay
  Scenario: Pay a monthly utility bill from checking
    When user pays a bill with the following details:
      | name          | Electric Company |
      | address       | 123 Grid St      |
      | city          | Metropolis       |
      | state         | NY               |
      | zipcode       | 10001            |
      | phone         | 5551237890       |
      | account       | 445566           |
      | verifyaccount | 445566           |
      | amount        | 75.50            |
      | fromaccount   | 13344            |
    Then bill payment should be successful

  @regression @billpay
  Scenario: Pay a rent bill from savings
    When user pays a bill with the following details:
      | name          | Landlord LLC     |
      | address       | 42 Main St       |
      | city          | Springfield      |
      | state         | IL               |
      | zipcode       | 62701            |
      | phone         | 5550001111       |
      | account       | 777888           |
      | verifyaccount | 777888           |
      | amount        | 1200.00          |
      | fromaccount   | 13344            |
    Then bill payment should be successful

  @regression @negative @billpay
  Scenario: Bill payment fails when required data is incomplete
    When user pays a bill with the following details:
      | name          | Cable Provider |
      | address       | 1 Fiber Way    |
      | city          | Gotham         |
      | state         | NJ             |
      | zipcode       | 07001          |
      | phone         | 5551112233     |
      | account       | 998877         |
      | verifyaccount | 001122         |
      | amount        |                |
      | fromaccount   | 13344          |
    Then bill payment should fail

  @regression @negative @billpay
  Scenario: Bill payment fails when payee name is missing
    When user pays a bill with the following details:
      | name          |                |
      | address       | 500 Elm St     |
      | city          | Star City      |
      | state         | CA             |
      | zipcode       | 90001          |
      | phone         | 5552223344     |
      | account       | 333222         |
      | verifyaccount | 333222         |
      | amount        |                |
      | fromaccount   | 13344          |
    Then bill payment should fail
