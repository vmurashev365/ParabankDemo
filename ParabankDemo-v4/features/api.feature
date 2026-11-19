Feature: Banking REST API Verification

  @api @smoke
  Scenario: Authenticated customer profile lists fixture checking and savings accounts
    When the banking API authenticates with default credentials
    Then the banking API returns status 200
    And the banking API lists accounts "54321" and "13344" for the authenticated customer

  @api @regression @negative
  Scenario: Invalid credentials are rejected by the banking API
    When the banking API authenticates username "john" with password "wrongpass"
    Then the banking API returns status 400

  @api @smoke @transfers
  Scenario: A direct API transfer updates both account balances and ledgers in cents
    Given the banking API records the balance of account "54321"
    And the banking API records the balance of account "13344"
    When the banking API transfers "11.25" from account "54321" to account "13344"
    Then the banking API returns status 200
    And the banking API reports account "54321" has a balance change of "-11.25" USD
    And the banking API reports account "13344" has a balance change of "11.25" USD
    And the banking API ledger for account "54321" records a "Debit" transaction of "11.25" USD
    And the banking API ledger for account "13344" records a "Credit" transaction of "11.25" USD
