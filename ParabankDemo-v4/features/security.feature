Feature: Authentication Security Controls

  Background:
    Given user is on the login page

  @security @regression
  Scenario Outline: SQL payloads are rejected
    When user attempts to login with username "<payload>" and password "<password>"
    Then user should remain on the login page

    Examples:
      | payload                          | password |
      | ' OR '1'='1                      | demo     |
      | " OR "1"="1"                  | demo     |
      | admin' UNION SELECT * FROM users | any      |

  @browser_compatibility @regression
  Scenario: Critical login path executes in supported browsers
    When user logs in with default credentials
    Then user should be logged in successfully
