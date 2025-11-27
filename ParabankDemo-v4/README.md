# ParaBank Demo v4 Test Execution

Use this guide to run the modular ParaBank v4 suite that lives entirely under `ParabankDemo-v4/`. All commands assume dependencies are already installed at the repository root (`npm install`) so that `../node_modules` contains Playwright, Cucumber, and ts-node.

## Project-specific runner

- `ParabankDemo-v4/cucumber.v4.js` scopes Cucumber to `ParabankDemo-v4/features/**/*.feature` and loads only the v4 step definitions in `ParabankDemo-v4/src/steps/**/*.ts`.
- `ParabankDemo-v4/package.json` exposes npm scripts that call the shared toolchain from the workspace root while keeping v3 files untouched.
- Run scripts either by changing into the folder (`cd ParabankDemo-v4 && npm run <script>`) or by using the `--prefix` flag from the repo root (`npm run --prefix ParabankDemo-v4 <script>`).

## Smoke suite

```bash
npm run --prefix ParabankDemo-v4 test:smoke
```

- Executes every scenario tagged `@smoke`, including the aggregated flows in `ParabankDemo-v4/features/smoke.feature` (login + accounts overview, quick transfer, and utility bill payment).
- Ideal for pre-merge gating because it covers the highest-signal UI journeys without touching negative/security paths.

Equivalent npx command:

```bash
npx cucumber-js --config ParabankDemo-v4/cucumber.v4.js --tags "@smoke"
```

## Full regression

```bash
npm run --prefix ParabankDemo-v4 test:regression
```

- Runs all `@regression`-tagged scenarios across the v4 feature set, including the end-to-end journey in `features/regression.feature`, transfer/bill pay/account validations, and any security or registration checks marked as regression.
- Use this nightly or before releasing to ensure every functional area still passes.

Equivalent npx command:

```bash
npx cucumber-js --config ParabankDemo-v4/cucumber.v4.js --tags "@regression"
```

## Single feature focus

```bash
npm run --prefix ParabankDemo-v4 test:feature:login
```

- Targets only `ParabankDemo-v4/features/login.feature`, which is helpful while iterating on login steps or debugging authentication flows.
- Swap `login.feature` for another path when you need to isolate a different module:

```bash
npx cucumber-js --config ParabankDemo-v4/cucumber.v4.js ParabankDemo-v4/features/accounts.feature
```

## Tagged runs (custom selections)

- Security-focused validation:

```bash
npm run --prefix ParabankDemo-v4 test:security
```

- Ad-hoc tag expressions: use the generic script and append any tags supported by Cucumber:

```bash
npm run --prefix ParabankDemo-v4 test:tags -- --tags "@security and not @wip"
```

- Direct npx alternative:

```bash
npx cucumber-js --config ParabankDemo-v4/cucumber.v4.js --tags "@security"
```

All commands above reference only the v4 feature files and step definitions, keeping the legacy v3 suite untouched while still allowing both suites to coexist in the same repository.
