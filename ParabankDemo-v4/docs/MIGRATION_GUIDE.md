# ParabankDemo v3.0 → v4.0 Migration Guide

This guide explains how to translate the legacy ParabankDemo v3.0 assets into the modular v4.0 suite that now lives inside `ParabankDemo-v4/`. Use it whenever you need to port scenarios, extend coverage, or reason about maintenance duties across both versions.

## 1. Architecture Differences

### 1.1 Step definitions: unified vs modular

- **v3** concentrated most bindings inside `src/steps/AuthenticationSteps.ts`, `src/steps/ParaBankSteps.ts`, and similar files that pulled selectors directly from `this.page`. Steps frequently mixed navigation, assertions, logging, and data setup in a single glue function, so the same concern was duplicated across unrelated scenarios.
- **v4** groups steps by domain (for example `ParabankDemo-v4/src/steps/login.steps.ts`, `transfer.steps.ts`, `accounts.steps.ts`, etc.). Each step instantiates a shared Flow (see section 1.2) via helpers such as `ensureAuthenticated` (`src/steps/stepHelpers.ts`), so test data setup and navigation is centralized and reusable.
- **Impact:** When migrating a scenario, expect to translate one or more legacy Given/When/Then blocks into the closest v4 domain-specific step. If the wording already exists (e.g., “user transfers "50.00" between accounts”), the step definition is ready to use; if not, create it in the relevant `*.steps.ts` file so it can share the same flow helpers.

### 1.2 Page Object Model (POM) layering

- **v3** only exposed three page classes (`src/pages/LoginPage.ts`, `RegisterPage.ts`, `BasePage.ts`). Responsibilities such as bill pay, account navigation, and transfer logic were scattered across step files instead of discrete POMs.
- **v4** adds explicit layers:
  - `ParabankDemo-v4/src/pages/` still houses page-level abstractions (e.g., `AccountsPage.ts`, `BillPayPage.ts`, `TransferPage.ts`).
  - `ParabankDemo-v4/src/components/` contains widgets that can be embedded inside multiple pages, such as `NavbarComponent.ts`, `TransferFormComponent.ts`, `TransactionsTableComponent.ts`, and `RegistrationFormComponent.ts`.
  - `ParabankDemo-v4/src/flows/` orchestrates end-to-end actions (e.g., `LoginFlow`, `TransferFlow`, `RegistrationFlow`) so steps can remain declarative.
- **Impact:** When looking for the code that drives a v4 step, start at the flow, then inspect the page and component it references. Most domain behavior now lives outside the raw step definition.

### 1.3 Feature grouping

- **v3** relied on a few monolithic `.feature` files (e.g., `features/account-management.feature` contains TC_051–TC_070) and nested folders such as `features/optimized/` with broad-purpose suites. Different personas, severities, and domains were mixed together, so targeting a reduced subset required tag gymnastics.
- **v4** keeps features intentionally small and domain-focused (`ParabankDemo-v4/features/login.feature`, `accounts.feature`, `billpay.feature`, `registration.feature`, `security.feature`). Aggregation happens only in `smoke.feature` and `regression.feature`, which import existing steps instead of redefining flows.
- **Impact:** Migrating content usually means splitting a long v3 scenario list into multiple short v4 feature files while preserving the tag semantics you need for pipelines.

### 1.4 Locator strategy

- **v3** selectors were hard-coded strings in each page object (e.g., `input[name="username"]`, `.error`, `#accountTable`) and relied on CSS that occasionally used brittle patterns such as `nth-child`.
- **v4** introduces `ParabankDemo-v4/src/locators/locatorHeuristics.ts` and `snapshotLocatorBuilder.ts` to centralize selector quality:
  - `isLocatorFragile()` flags patterns like `nth-child` or randomized class names before they reach the repo.
  - `suggestTestId()` enforces predictable `data-test` naming.
  - `extractInputsAndButtons()` can parse HTML snapshots and recommend `getByRole`/`getByLabel` selectors.
  - Components now prefer Playwright role queries (`getByRole('link', { name: /transfer funds/i })`) so accessibility metadata drives automation.
- **Impact:** When migrating or adding elements, either reuse an existing component method or add a new method that builds on the heuristics instead of embedding a raw selector inside a step.

## 2. Mapping Tables

### 2.1 v3 Pages → v4 Pages/Components/Flows

| v3 asset | v4 replacement(s) | What changed |
| --- | --- | --- |
| `src/pages/LoginPage.ts` | `ParabankDemo-v4/src/pages/LoginPage.ts`, `components/NavbarComponent.ts`, `flows/LoginFlow.ts` | Navigation and logout logic moved into `NavbarComponent`, authentication orchestration moved into `LoginFlow`, and login steps simply call the flow. |
| `src/pages/RegisterPage.ts` | `ParabankDemo-v4/src/pages/RegisterPage.ts`, `components/RegistrationFormComponent.ts`, `flows/RegistrationFlow.ts` | Form fill logic is encapsulated by a component so validations and happy paths share the same helpers; flows decide which dataset to use. |
| `src/pages/BasePage.ts` | `ParabankDemo-v4/src/pages/BasePage.ts`, `components/BaseComponent.ts`, `flows/BaseFlow.ts` | Cross-cutting helpers are split between the new Base classes so components and flows inherit consistency without duplicating Playwright calls. |
| (Account/bill pay actions embedded in `OptimizedAccountSteps.ts` and other glue files) | `ParabankDemo-v4/src/pages/AccountsPage.ts`, `BillPayPage.ts`, `components/AccountsFilterComponent.ts`, `BillPayFormComponent.ts`, `flows/AccountsFlow.ts`, `BillPayFlow.ts`, `TransferFlow.ts` | Previously step-level logic now lives inside dedicated page/component/flow combinations, unlocking reuse for accounts, transfers, and payments. |

### 2.2 v3 Feature → v4 Feature(s)

| v3 feature file | v4 feature(s) | Notes |
| --- | --- | --- |
| `features/account-management.feature` | `ParabankDemo-v4/features/accounts.feature`, `transfer.feature`, `billpay.feature`, `registration.feature`, `smoke.feature`, `regression.feature` | TC_051–TC_070 are split by domain; regression and smoke files provide the cross-domain journeys that TC_070 previously covered. |
| `features/registration.feature` | `ParabankDemo-v4/features/registration.feature`, `security.feature` | Happy-path registration folds into `@smoke` while validation/error behaviors move into dedicated validation and security scenarios. |
| `features/advanced-security-tests.feature` | `ParabankDemo-v4/features/security.feature` | SQL/XSS guardrails plus browser compatibility now reuse the shared login steps. |
| `features/unified/complete-parabank-suite.feature` | `ParabankDemo-v4/features/smoke.feature`, `regression.feature` | The one-file “do everything” suite is replaced by curated aggregators that reference existing steps so coverage remains transparent. |

### 2.3 v3 Tags → v4 Tag Usage

| v3 tag | v4 equivalent | Notes |
| --- | --- | --- |
| `@automated` | (implicit) | All v4 scenarios execute in CI by default, so the tag is no longer required; rely on `@smoke`/`@regression` collections instead. |
| `@critical`, `@high`, `@medium` | `@critical` (selective) | Severity tagging still exists but is only applied where gating matters (e.g., login smoke). Use test case metadata or Jira for granular priority. |
| Domain tags (`@accounts`, `@billpay`, `@transfers`, `@registration`) | Same tag names | Domain tags still drive suite slicing; each v4 feature keeps the corresponding domain tag at the scenario level. |
| `@validation`, `@negative`, `@positive` | Same tag names | Validation/negative/positive intent tags are retained for analytics; they now pair with `@regression` when scenarios leave the smoke lane. |
| `@security`, `@integration`, `@audit` | `@security`, `@browser_compatibility`, `@regression` | Security remains as-is, while integration/audit concerns are tracked through `@regression` plus targeted scenarios in `security.feature`. |
| `@smoke` | `@smoke` (curated) | Instead of tagging dozens of scenarios, only two high-signal flows live in `smoke.feature`; auxiliary flows should rely on regression tags. |

## 3. How to Locate the v4 Counterpart of a v3 Scenario

1. **Start from the v3 ID or tag.** Each legacy scenario exposes TC numbers and domain tags (e.g., `@transfers @TC_056`). Note both before moving on.
2. **Consult the mapping tables.** Use Section 2.2 to jump from the legacy feature file to the v4 file set. Example: TC_056 lives in `features/account-management.feature`, so its v4 home is `ParabankDemo-v4/features/transfer.feature` (plus the aggregated entries in `smoke.feature`/`regression.feature`).
3. **Search inside `ParabankDemo-v4/features`.** Within VS Code, run `CTRL+SHIFT+F` for the TC string, tag, or scenario title fragment. Scenarios are intentionally short, so matches are unambiguous.
4. **Open the related step file.** Each feature name matches a step module (`transfer.feature` ↔ `src/steps/transfer.steps.ts`). Step helpers such as `ensureAuthenticated()` show how background flows are satisfied.
5. **Trace into flows and components.** From the step file, follow the imported flow (for example, `TransferFlow` in `src/flows/TransferFlow.ts`) to understand how the action is executed and which page/component implements the locator logic. This is especially useful when an assertion fails and you need to identify the specific component (`TransferFormComponent`, `NavbarComponent`, etc.).
6. **Cross-check assertions.** Shared assertions live in `ParabankDemo-v4/src/assertions`. If the v3 scenario expected a particular message (e.g., bill pay failure), look for an assertion helper before writing a new one.

## 4. Deprecation Strategy (Keep v3, Prefer v4)

- **Freeze v3 to bug-fix mode.** Accept only blocking fixes in `/features` and `/src` at the repo root; all net-new coverage should be authored in `ParabankDemo-v4/`.
- **Run both suites in CI temporarily.** Execute v3 nightly (or on a slower cadence) while making v4 the required gate. Compare tag-level pass/fail stats to prove parity before reducing v3 frequency.
- **Map outstanding TC gaps.** Maintain a checklist where each v3 TC maps to a v4 scenario name. For gaps, either expand an existing v4 feature or add a new one under the appropriate domain folder.
- **Share data helpers and configs.** Whenever fixes land in v3 utilities (e.g., credentials, env setup), port them into the v4 equivalents immediately so test data drift does not occur.
- **Communicate the sunset path.** Once v4 has matched or exceeded v3 coverage for two consecutive sprints, officially mark v3 scenarios as “legacy reference” in documentation, hide them from default test runs, but keep the files for auditing or exploratory comparisons.

Following this guide ensures every v3 test engineer can locate the right v4 scenario, understand the supporting code layers, and plan a controlled deprecation path without deleting the legacy suite.
