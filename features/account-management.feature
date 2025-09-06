Feature: ParaBank Account Management - Extended Test Coverage
  As a ParaBank customer
  I want to manage my banking accounts effectively
  So that I can perform various banking operations safely

  Background:
    Given ParaBank application is accessible
    And test environment is configured per TPS-PARABANK-001
    And test data is prepared per TDMP-PARABANK-001

  @automated @accounts @critical @TC_051
  Scenario: TC_051 - View account overview successfully
    Given I am logged in as user "john"
    When I navigate to accounts overview page
    Then I should see my account summary
    And I should see account balances
    And I should see available accounts list
    And I should see recent transaction information

  @automated @accounts @high @TC_052
  Scenario: TC_052 - View account details for specific account
    Given I am logged in as user "john"
    And I am on accounts overview page
    When I click on first account number
    Then I should see detailed account information
    And I should see account number
    And I should see account type
    And I should see current balance
    And I should see account activity link

  @automated @accounts @medium @TC_053
  Scenario: TC_053 - Navigate between different account views
    Given I am logged in as user "john"
    And I have multiple accounts available
    When I switch between different account views
    Then each account should display correct information
    And account balances should be accurate
    And navigation should be smooth
    And no errors should occur

  @automated @navigation @medium @TC_054
  Scenario: TC_054 - Access different banking services from menu
    Given I am logged in as user "john"
    When I access "Open New Account" from navigation menu
    Then I should see account opening form
    When I access "Transfer Funds" from navigation menu
    Then I should see funds transfer form
    When I access "Bill Pay" from navigation menu
    Then I should see bill payment form
    When I access "Find Transactions" from navigation menu
    Then I should see transaction search form

  @automated @functionality @medium @TC_055
  Scenario: TC_055 - Verify account menu accessibility and responsiveness
    Given I am logged in as user "john"
    When I hover over account menu items
    Then menu items should highlight properly
    And menu items should be clickable
    When I use keyboard navigation on menu
    Then menu should be accessible via keyboard
    And focus should move correctly between items
    And I should be able to activate menu items with Enter key

  @automated @transfers @critical @TC_056
  Scenario: TC_056 - Transfer funds between accounts
    Given I am logged in as user "john"
    And I have multiple accounts with sufficient balances
    When I navigate to "Transfer Funds" page
    And I select source account
    And I select destination account
    And I enter transfer amount "100.00"
    And I click "Transfer" button
    Then transfer should be completed successfully
    And I should see confirmation message
    And account balances should be updated correctly
    And transaction should appear in both account histories

  @automated @billpay @high @TC_057
  Scenario: TC_057 - Bill payment functionality
    Given I am logged in as user "john"
    And I have account with sufficient balance
    When I navigate to "Bill Pay" page
    And I enter payee name "Electric Company"
    And I enter payee address details
    And I enter account number "123456789"
    And I select payment account
    And I enter payment amount "75.50"
    And I click "Send Payment" button
    Then payment should be processed successfully
    And I should see payment confirmation
    And account balance should be reduced by payment amount
    And payment should appear in transaction history

  @automated @transactions @medium @TC_058
  Scenario: TC_058 - Transaction history view
    Given I am logged in as user "john"
    And I have account with transaction history
    When I navigate to "Account Activity" page
    And I select specific account
    Then I should see list of all transactions
    And transactions should be sorted by date (newest first)
    And each transaction should show date, description, and amount
    And transaction types should be clearly indicated (debit/credit)
    And running balance should be displayed
    When I filter transactions by date range
    Then only transactions within selected range should be displayed

  @automated @activity @medium @TC_059
  Scenario: TC_059 - Account activity details
    Given I am logged in as user "john"
    And I have account with recent activity
    When I click on specific transaction
    Then I should see detailed transaction information
    And transaction details should include timestamp
    And transaction details should include transaction ID
    And transaction details should include full description
    And transaction details should include reference numbers
    When I navigate back to activity list
    Then I should return to same position in transaction list

  @automated @search @medium @TC_060
  Scenario: TC_060 - Account search and filtering
    Given I am logged in as user "john"
    And I have multiple accounts and transactions
    When I use search functionality
    And I search for specific transaction description
    Then matching transactions should be displayed
    And search results should be highlighted
    When I filter by transaction type "Transfer"
    Then only transfer transactions should be shown
    When I filter by amount range "$50 to $200"
    Then only transactions within amount range should be displayed
    And filter combinations should work correctly

  @automated @smoke @critical @TC_061
  Scenario: TC_061 - Display accounts overview
    Given I am logged in as user "john"
    When I view accounts overview page
    Then I should see all my accounts listed
    And balances should be displayed in currency format
    And account types should be clearly indicated
    And each account should show account number
    And each account should show available balance
    And total portfolio value should be calculated correctly

  @automated @accounts @high @TC_062
  Scenario: TC_062 - Account overview with multiple account types
    Given I am logged in as user "john"
    And I have both checking and savings accounts
    When I view accounts overview page
    Then I should see all account types displayed correctly
    And checking accounts should be clearly labeled
    And savings accounts should be clearly labeled
    And account type icons should be visible and correct
    And accounts should be grouped or sorted logically
    And each account type should show appropriate features

  @automated @accounts @medium @TC_063
  Scenario: TC_063 - Account overview navigation and links
    Given I am logged in as user "john"
    And I am on accounts overview page
    When I click on first account number link
    Then I should navigate to account details page
    When I return to accounts overview
    And I click on account activity link
    Then I should see transaction history for that account
    When I return to accounts overview
    Then navigation should work consistently for all accounts
    And page state should be preserved correctly

  @automated @accounts @medium @TC_064
  Scenario: TC_064 - Account overview refresh and real-time updates
    Given I am logged in as user "john"
    And I have accounts with known balances
    When I view accounts overview page
    And I note current account balances
    And I refresh the page
    Then account balances should remain consistent
    And page should load without errors
    And all account information should be preserved
    When I navigate away and return to overview
    Then all account data should still be accurate
    And page performance should be acceptable

  @automated @accounts @validation @TC_065
  Scenario: TC_065 - Account overview data integrity validation
    Given I am logged in as user "john"
    And I have multiple accounts with different balances
    When I view accounts overview page
    Then each account number should be unique and valid
    And account balances should match transaction totals
    And available amounts should not exceed actual balances
    And negative balances should be clearly indicated with proper formatting
    And currency symbols should be consistent across all accounts
    And date information should be accurate and properly formatted
    And no duplicate accounts should be displayed

  @automated @validation @critical @TC_066
  Scenario: TC_066 - Account balance accuracy
    Given I am logged in with known account balances
    When I view accounts overview
    Then displayed balances should match database values
    And currency formatting should be correct ($1,234.56)
    And negative balances should be properly indicated
    And balance calculations should be precise to cents
    When I refresh the page
    Then balances should remain consistent
    And no discrepancies should appear

  @automated @accountopening @high @TC_067
  Scenario: TC_067 - Open new account functionality
    Given I am logged in as user "john"
    And I have existing account for deposit source
    When I navigate to "Open New Account" page
    And I select account type "SAVINGS"
    And I select source account for initial deposit
    And I enter minimum opening deposit "100.00"
    And I click "Open New Account" button
    Then new account should be created successfully
    And I should see new account confirmation
    And new account should appear in accounts overview
    And initial deposit should be transferred correctly

  @automated @accountservices @medium @TC_068
  Scenario: TC_068 - Account services and management
    Given I am logged in as user "john"
    And I have active accounts available
    When I navigate to account services page
    And I request account statement for last month
    Then statement should be generated successfully
    And statement should include all transactions for period
    When I update account preferences
    And I change notification settings to "EMAIL"
    Then preferences should be saved successfully
    And updated preferences should be reflected in account

  @automated @loansservices @medium @TC_069
  Scenario: TC_069 - Loan application and management
    Given I am logged in as user "john"
    And I have established account history
    When I navigate to "Request Loan" page
    And I enter loan amount "5000.00"
    And I enter down payment "500.00"
    And I select collateral account
    And I submit loan application
    Then loan application should be processed
    And I should see loan application status
    And loan details should be available in accounts overview
    When loan is approved
    Then loan amount should be deposited to selected account

  @automated @integration @critical @TC_070
  Scenario: TC_070 - Comprehensive account integration test
    Given I am logged in as user "john"
    And I have multiple accounts with various balances
    When I perform transfer between accounts
    And I make bill payment from checking account
    And I view updated transaction history
    Then all transactions should be recorded accurately
    And account balances should reflect all changes
    And transaction timestamps should be sequential
    When I generate account summary report
    Then report should include all account activities
    And balance reconciliation should be accurate
    And no data inconsistencies should exist
