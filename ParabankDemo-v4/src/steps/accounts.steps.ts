import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { AccountsFlow } from '../flows/AccountsFlow';
import { expectAccountDetailsVisible, expectAccountOverviewVisible } from '../assertions/accountAssertions';
import { ensureAuthenticated } from './stepHelpers';

const getAccountsFlow = (world: any): AccountsFlow =>
  world.accountsFlow ?? (world.accountsFlow = new AccountsFlow(world.page));

Given('user is viewing the accounts overview', async function () {
  await ensureAuthenticated(this);
  await getAccountsFlow(this).viewAccountsOverview();
});

When('user opens the accounts overview', async function () {
  await ensureAuthenticated(this);
  await getAccountsFlow(this).viewAccountsOverview();
});

When('user lists all account summaries', async function () {
  await ensureAuthenticated(this);
  this.accountSummaries = await getAccountsFlow(this).listAccountSummaries();
});

When('user opens account details for {string}', async function (accountNumber: string) {
  await ensureAuthenticated(this);
  await getAccountsFlow(this).openAccountDetails(accountNumber);
});

When('user returns to the accounts overview', async function () {
  await ensureAuthenticated(this);
  await getAccountsFlow(this).viewAccountsOverview();
});

Then('accounts overview should be visible', async function () {
  await expectAccountOverviewVisible(this.page);
});

Then('account details should be visible', async function () {
  await expectAccountDetailsVisible(this.page);
});

Then('user should see at least {int} accounts listed', async function (minimum: number) {
  const rows = this.accountSummaries ?? (await getAccountsFlow(this).listAccountSummaries());
  expect(rows.length).toBeGreaterThanOrEqual(minimum);
});
