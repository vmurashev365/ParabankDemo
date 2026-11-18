# Writing a banking scenario

Start with the customer action and its observable outcome. In a monetary scenario, name the amount and accounts. A transfer receipt identifies the payment. Checking both balances establishes that the debit and credit reached the accounts.

## Where code belongs

| Location | Responsibility |
| --- | --- |
| `features/` | Business rules, named examples, setup and expected outcomes |
| `src/steps/` | Translate Gherkin into typed page actions and assertions |
| `src/pages/` and `src/components/` | Own each locator in one place. Scope controls to their form or table. |
| `src/assertions/` | Compare visible receipts and validation messages with the expected values |
| `src/support/` | Scenario World, browser lifecycle and currency conversion |

Use `function (this: V4World, ...)` for step callbacks. Keep scenario-specific data, such as opening balances, on the World. Navigation belongs in an explicit step. A form submission operates on the page already open.

## Banking examples

- Capture opening balances before the transfer. Compare the closing balance of each account with its own opening balance plus the signed change in integer cents.
- Identify receipts by their amount and account numbers. On a bill payment, also verify the named payee.
- In a validation test, invalidate one input at a time. Assert the visible field message. When the expected outcome includes no posting, check the original balance again.
- Use the controlled instance and synthetic test data. The shared customer requires serial execution for balance comparisons.

Run `npm run type-check`, `npm run lint` and `npm run format:check` before the relevant Cucumber selection. The smoke suite uses the same naming and tooling conventions as the Moodle and Logistics portfolio projects.
