import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { V4World } from '../support/world';
import { expectAccountDetailsVisible, expectAccountOverviewVisible } from '../assertions/accountAssertions';
import { usdToCents } from '../support/money';
import { signIn } from './stepHelpers';

Given('user is viewing the accounts overview', async function (this: V4World) {
  await signIn(this);
  await expectAccountOverviewVisible(this.page);
});

When('user opens the accounts overview', async function (this: V4World) {
  await this.navbar.gotoAccounts();
});

When('user opens account details for {string}', async function (this: V4World, account: string) {
  await this.accounts.openAccountDetails(account);
});

When('user returns to the accounts overview', async function (this: V4World) {
  await this.navbar.gotoAccounts();
});

Then('accounts overview should be visible', async function (this: V4World) {
  await expectAccountOverviewVisible(this.page);
});

Then('account details should be visible', async function (this: V4World) {
  await expectAccountDetailsVisible(this.page);
});

Then('user should see at least {int} accounts listed', async function (this: V4World, minimum: number) {
  await expect.poll(() => this.accounts.accountLinks.count()).toBeGreaterThanOrEqual(minimum);
});

Given('the customer records the balance of account {string}', async function (this: V4World, account: string) {
  this.balancesBefore.set(account, await this.accounts.balanceInCents(account));
});

Then(
  'account {string} has a balance change of {string} USD',
  async function (this: V4World, account: string, change: string) {
    const before = this.balancesBefore.get(account);
    if (before === undefined) throw new Error(`Record the opening balance of account ${account} first.`);
    const expectedClosing = before + usdToCents(change);
    const actualClosing = await this.accounts.balanceInCents(account);
    this.balancesAfter.set(account, actualClosing);
    await this.attach(
      JSON.stringify({ account, unit: 'USD cents', opening: before, expectedClosing, actualClosing }, null, 2),
      'application/json',
    );
    expect(actualClosing, `Closing balance in cents for account ${account}`).toBe(expectedClosing);
  },
);
