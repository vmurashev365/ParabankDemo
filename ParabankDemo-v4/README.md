# ParaBank Banking QA Automation Platform

This portfolio project tests customer banking workflows against a local ParaBank instance. Cucumber describes the operations, Playwright drives the browser, and TypeScript checks the test code.

## Banking workflows

| Workflow          | What the test verifies                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Internal transfer | Move $25.37 from checking to savings. Verify both account numbers and the amount on the receipt, then return to the overview and compare both balances with their opening values in cents. |
| Bill payment      | Compare the payee, amount and funding account on the receipt with the submitted payment. Reject mismatched payee account numbers and verify the funding balance stays unchanged.           |
| Customer access   | Sign in, open an account, sign out and return to the login screen. Registration scenarios exercise the form with synthetic customer details.                                               |

Start with the [transfer scenario](features/transfer.feature), its [transfer steps](src/steps/transfer.steps.ts), the [balance checks](src/steps/accounts.steps.ts) and the [accounts page](src/pages/AccountsPage.ts) to follow the money through the UI.

## Quick start

Use Node.js 22 and Docker Compose. Run these commands from `ParabankDemo-v4/`.

```sh
npm ci
npx playwright install chromium
npm run docker:start
```

Open the [local ParaBank login page](http://127.0.0.1:8081/parabank/index.htm). Once it is ready, run the smoke scenarios.

```sh
npm run test:smoke
```

Open [the Cucumber HTML report](reports/cucumber/report.html) after the run. Balance checks attach the opening balance and the expected and observed closing balances in cents. Failed browser scenarios attach a screenshot to the report. Each run replaces the local report.

## Running tests

| Command                                                      | Selection                                                                          |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `npm run test:smoke`                                         | Customer login, registration, accounts, transfers and bill payment                 |
| `npm run test:regression`                                    | Tagged regression scenarios, including validation and multi-step customer journeys |
| `npm run test:feature:login`                                 | Login feature only                                                                 |
| `npm run test:tags -- --tags "@transfers"`                   | One domain                                                                         |
| `npm run test:dry-run`                                       | Check step bindings without opening a browser                                      |
| `npm run type-check`, `npm run lint`, `npm run format:check` | TypeScript, ESLint and Prettier                                                    |
| `npm run docker:stop`                                        | Stop this project's local ParaBank container                                       |

## Test data and environment

The pinned Docker image supplies the demo customer `john` / `demo`, checking account `54321` and savings account `13344`. Each scenario starts with a fresh browser session. The customer and accounts persist between scenarios, so Cucumber runs them sequentially. Payments and transfers post to these demo accounts. Use a dedicated instance and keep other runs off it while comparing balances.

The default host is `http://127.0.0.1:8081`. To use another test instance, set `PARABANK_BASE_URL` to its origin. Override `PARABANK_USERNAME` and `PARABANK_PASSWORD` for a customer with the required fixture accounts. `PARABANK_HEADLESS=false` shows the browser. `PARABANK_BROWSER` selects chromium, firefox or webkit after the matching Playwright browser is installed.

## Known findings

- **Empty transfer amount.** On the pinned image, submitting an empty amount leaves the field validation message hidden. The regression expects the visible message and reports the failure.
- **Step binding.** One example row in the original security feature contains embedded quotation marks and produces an undefined step during a full dry run.

See the [coding guide](docs/CODING_STANDARDS.md) for the conventions used to extend the suite.
