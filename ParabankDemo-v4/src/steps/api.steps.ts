import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { numberToCents, usdToCents } from '../support/money';
import type { V4World } from '../support/world';
import { defaultPassword, defaultUsername } from './stepHelpers';

Given('the banking API records the balance of account {string}', async function (this: V4World, account: string) {
  const balance = await this.api.getAccountBalanceInCents(account);
  this.balancesBefore.set(account, balance);
});

When('the banking API authenticates with default credentials', async function (this: V4World) {
  const result = await this.api.login(defaultUsername, defaultPassword);
  this.lastApiStatus = result.status;
  this.lastApiCustomer = result.customer;
});

When(
  'the banking API authenticates username {string} with password {string}',
  async function (this: V4World, username: string, password: string) {
    const result = await this.api.login(username, password);
    this.lastApiStatus = result.status;
    this.lastApiCustomer = result.customer;
  },
);

When(
  'the banking API transfers {string} from account {string} to account {string}',
  async function (this: V4World, amount: string, fromAccount: string, toAccount: string) {
    const result = await this.api.transfer(fromAccount, toAccount, amount);
    this.lastApiStatus = result.status;
  },
);

Then('the banking API returns status {int}', async function (this: V4World, expectedStatus: number) {
  expect(this.lastApiStatus, 'HTTP status from ParaBank REST API').toBe(expectedStatus);
});

Then(
  'the banking API lists accounts {string} and {string} for the authenticated customer',
  async function (this: V4World, firstAccount: string, secondAccount: string) {
    if (!this.lastApiCustomer) {
      throw new Error('Authenticate via the banking API before listing customer accounts.');
    }
    const accounts = await this.api.getCustomerAccounts(this.lastApiCustomer.id);
    const ids = accounts.map((account) => String(account.id));
    expect(ids).toEqual(expect.arrayContaining([firstAccount, secondAccount]));
  },
);

Then(
  'the banking API reports account {string} has a balance change of {string} USD',
  async function (this: V4World, account: string, change: string) {
    const opening = this.balancesBefore.get(account);
    if (opening === undefined) {
      throw new Error(`Record the opening API balance of account ${account} first.`);
    }
    const expectedClosing = opening + usdToCents(change);
    const actualClosing = await this.api.getAccountBalanceInCents(account);
    await this.attach(
      JSON.stringify(
        { source: 'REST API', account, unit: 'USD cents', opening, expectedClosing, actualClosing },
        null,
        2,
      ),
      'application/json',
    );
    expect(actualClosing, `API closing balance in cents for account ${account}`).toBe(expectedClosing);
  },
);

Then(
  'the banking API balance of account {string} matches the UI balance',
  async function (this: V4World, account: string) {
    const uiClosing = this.balancesAfter.get(account);
    if (uiClosing === undefined) {
      throw new Error(`Verify the UI closing balance of account ${account} before reconciling with the API.`);
    }
    const apiClosing = await this.api.getAccountBalanceInCents(account);
    await this.attach(
      JSON.stringify({ reconciliation: 'UI vs REST API', account, unit: 'USD cents', uiClosing, apiClosing }, null, 2),
      'application/json',
    );
    expect(apiClosing, `API balance in cents should match UI balance for account ${account}`).toBe(uiClosing);
  },
);

Then(
  'the banking API ledger for account {string} records a {string} transaction of {string} USD',
  async function (this: V4World, account: string, type: string, amount: string) {
    const expectedCents = usdToCents(amount);
    const transactions = await this.api.getAccountTransactions(account);
    const match = transactions.find(
      (tx) => tx.type.toLowerCase() === type.toLowerCase() && numberToCents(tx.amount) === expectedCents,
    );
    expect(match, `Expected a ${type} transaction of ${amount} USD in ledger for account ${account}`).toBeDefined();
  },
);

Then(
  'the banking API ledger for account {string} records a {string} transaction of {string} USD mentioning {string}',
  async function (this: V4World, account: string, type: string, amount: string, keyword: string) {
    const expectedCents = usdToCents(amount);
    const transactions = await this.api.getAccountTransactions(account);
    const match = transactions.find(
      (tx) =>
        tx.type.toLowerCase() === type.toLowerCase() &&
        numberToCents(tx.amount) === expectedCents &&
        tx.description.toLowerCase().includes(keyword.toLowerCase()),
    );
    expect(
      match,
      `Expected a ${type} transaction of ${amount} USD mentioning "${keyword}" in ledger for account ${account}`,
    ).toBeDefined();
  },
);
