Feature: Funds Transfer Workflows

  Background:
    Given user is on the transfer page

  @smoke @transfers
  Scenario: Quick transfer between default accounts
    When user transfers "100.00" between accounts
    Then transfer should be successful

  @regression @transfers
  Scenario: Customer selects explicit accounts for transfer
    When user transfers "50.00" from account "13344" to account "13344"
    Then transfer should be successful

  @regression @negative
  Scenario: Large transfer is processed successfully
    When user transfers "5000.00" above balance
    Then transfer should be successful

  @regression @transfers
  Scenario: Customer transfers funds between two different accounts
    When user transfers "25.00" from account "13344" to account "13344"
    Then transfer should be successful

  @regression @transfers
  Scenario: Customer performs two transfers in a row
    When user transfers "10.00" between accounts
    And user transfers "15.00" between accounts
    Then transfer should be successful

  @regression @negative
  Scenario: Transfer fails when amount is empty
    When user transfers "" between accounts
    Then an error message should be shown
