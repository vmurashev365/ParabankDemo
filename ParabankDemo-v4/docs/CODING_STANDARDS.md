# Writing a banking scenario

Start with the customer action and its observable outcome. In a monetary scenario, name the amount and accounts. A transfer receipt identifies the payment; checking both balances in integer cents and reconciling with the REST API establishes that the debit and credit reached the ledger.

## Where code belongs

| Location                           | Responsibility                                                            |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `features/`                        | Business rules, named examples, setup, and expected outcomes              |
| `src/steps/`                       | Translate Gherkin into typed page, API, and assertion calls               |
| `src/pages/` and `src/components/` | Own each locator in one place. Scope controls to their form or table.     |
| `src/api/`                         | Typed `APIRequestContext` client for REST verification and ledger checks  |
| `src/assertions/`                  | Compare visible receipts and validation messages with expected values     |
| `src/support/`                     | Scenario World, worker-scoped browser + per-scenario context, money math  |
| `tests/`                           | Fast unit tests (`node --test`) for pure utilities without a browser      |

Use `function (this: V4World, ...)` for step callbacks. Keep scenario-specific state (such as opening and closing balances) on the World. Navigation belongs in an explicit step; a form submission operates on the page already open.

## Banking conventions

- Capture opening balances before money moves. Compare each account's closing balance with its opening balance plus the signed change in integer cents (`usdToCents` / `numberToCents`), and format expected receipts via `formatUsdAmount`.
- Reconcile UI closing balances and ledger entries against `/parabank/services/bank/...` via `this.api`.
- Tag pure HTTP scenarios with `@api` so `Before` skips browser launch completely.
- Identify receipts by their amount and account numbers. On a bill payment, also verify the named payee and debit entry.
- In a validation test, invalidate one input at a time. Assert the visible field message, and when no posting should occur, confirm the balance stays unchanged (`0.00`).
- Tag confirmed application defects with `@known-bug` so regression stays green while defects remain executable on demand.
- Use the pinned Docker instance and synthetic test data. Shared demo accounts require serial execution for deterministic balance comparisons.

Run `npm run type-check`, `npm run lint`, `npm run format:check`, `npm run test:unit`, and `npm run test:dry-run` before running browser or API selections.
