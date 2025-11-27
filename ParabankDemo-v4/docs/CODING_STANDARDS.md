# ParabankDemo v4 Coding Standards

## Page Object Model (POM)

- Each page class extends `BasePage`, owns only its page-specific actions, and exposes typed locator getters for reuse.
- Keep page methods action-oriented (navigate, fill, click); push validation logic into `src/assertions`.
- Share no state between page objects other than the injected Playwright `Page` instance.

## Components

- Components extend `BaseComponent`, encapsulate DOM fragments (navbar, forms, banners), and expose high-level actions such as `submit()` or `logout()`.
- Component constructors should receive a root locator; avoid querying the global page directly from within component methods unless absolutely necessary.

## Flows

- Flows extend `BaseFlow` and orchestrate page/component calls to express a business intent (login, transfer, registration).
- Flows must not introduce raw locators; they strictly compose existing page/component APIs for clarity and reuse.

## Step Definitions

- Steps stay declarative (1–3 lines) and only invoke flows or assertion helpers.
- Do not import Playwright locators or manipulate `page` directly; rely on the shared abstractions for navigation and actions.

## Locator Strategy

- Prefer Playwright’s semantic helpers: `getByRole`, `getByLabel`, `getByTestId`, and `getByText` (in that order).
- Avoid XPath altogether—ESLint warns when `page.locator('//...')` is detected; replace with accessible locators or component test IDs.
- Use `locatorHeuristics.ts` helpers to suggest consistent `data-testid` values when the DOM lacks accessible hooks.

## Naming Conventions

- Classes and enums: `PascalCase` (e.g., `LoginPage`, `TransferFlow`).
- Methods, properties, variables: `camelCase` (e.g., `loginWithCredentials`).
- Constants and environment keys: `UPPER_SNAKE_CASE`.
- Test IDs: kebab-case derived via `suggestTestId` (`login-form-username`).

## Tooling & Formatting

- ESLint enforces no implicit `any`, no unused variables, `prefer-const`, and limits files to 400 lines; fix warnings before committing.
- Prettier formats the codebase (2 spaces, 120 columns, single quotes, trailing commas on all multi-line structures); run it on save or via npm scripts.
