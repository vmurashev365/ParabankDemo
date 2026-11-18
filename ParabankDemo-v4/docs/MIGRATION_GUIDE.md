# Migrating v3 scenarios to v4

Run v4 from its own directory with its own lockfile. Install and validate it using the [quick start](../README.md#quick-start).

1. Find the customer workflow in `features/` and its corresponding domain file in `src/steps/`. Reuse an existing phrase when its action and expected result match.
2. Move browser interactions into the relevant Page Object or form component. Use relative routes for pages so the whole scenario stays on the configured stand.
3. Keep setup, submission and verification visible in the feature. Access the current scenario's page objects through `V4World`.
4. For money movement, specify the funding and destination accounts and the amount. Compare a receipt and the relevant balance changes using the [banking conventions](CODING_STANDARDS.md).
5. Run the feature with `npm run test:tags -- features/transfer.feature`, substituting the path to the feature being migrated. Review the step report before adding the scenario to smoke.
