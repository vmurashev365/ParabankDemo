Feature: Transfers between customer accounts

  @regression @transfers
  Scenario Outline: An internal transfer debits and credits the same amount
    Given user is viewing the accounts overview
    And the customer records the balance of account "<fromAccount>"
    And the customer records the balance of account "<toAccount>"
    When user navigates to the "Transfer Funds" page via the navbar
    And user transfers "<amount>" from account "<fromAccount>" to account "<toAccount>"
    Then the transfer receipt shows "<amount>" from "<fromAccount>" to "<toAccount>"
    When user returns to the accounts overview
    Then account "<fromAccount>" has a balance change of "-<amount>" USD
    And account "<toAccount>" has a balance change of "<amount>" USD
    And the banking API balance of account "<fromAccount>" matches the UI balance
    And the banking API balance of account "<toAccount>" matches the UI balance
    And the banking API ledger for account "<fromAccount>" records a "Debit" transaction of "<amount>" USD
    And the banking API ledger for account "<toAccount>" records a "Credit" transaction of "<amount>" USD

    @smoke
    Examples: Checking to savings
      | fromAccount | toAccount | amount |
      | 54321       | 13344     | 25.37  |

    Examples: One cent in the opposite direction
      | fromAccount | toAccount | amount |
      | 13344       | 54321     | 0.01   |

  @regression @transfers
  Scenario Outline: Customer performs two transfers in a row
    Given user is on the transfer page
    When user transfers "<firstAmount>" from account "<fromAccount>" to account "<toAccount>"
    Then the transfer receipt shows "<firstAmount>" from "<fromAccount>" to "<toAccount>"
    When user navigates to the "Transfer Funds" page via the navbar
    And user transfers "<secondAmount>" from account "<fromAccount>" to account "<toAccount>"
    Then the transfer receipt shows "<secondAmount>" from "<fromAccount>" to "<toAccount>"

    Examples: Two transfers from savings
      | fromAccount | toAccount | firstAmount | secondAmount |
      | 13344       | 54321     | 10.00       | 15.00        |

  @regression @transfers
  Scenario Outline: ParaBank issues a receipt for a large same-account transfer
    Given user is on the transfer page
    When user transfers "<amount>" from account "<account>" to account "<account>"
    Then the transfer receipt shows "<amount>" from "<account>" to "<account>"

    Examples: Same source and destination
      | account | amount  |
      | 13344   | 5000.00 |

  # Known ParaBank defect on the pinned image: submitting an empty transfer amount
  # calls the backend directly and displays a generic error instead of #amount.errors.
  @known-bug @negative @transfers
  Scenario Outline: Transfer requires an amount
    Given user is on the transfer page
    When user transfers "" from account "<fromAccount>" to account "<toAccount>"
    Then the transfer form shows "The amount cannot be empty."

    Examples: Checking to savings
      | fromAccount | toAccount |
      | 54321       | 13344     |
