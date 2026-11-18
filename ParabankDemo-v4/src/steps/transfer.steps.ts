import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { expectTransferReceipt } from '../assertions/transferAssertions';
import type { V4World } from '../support/world';
import { signIn } from './stepHelpers';

Given('user is on the transfer page', async function (this: V4World) {
  await signIn(this);
  await this.navbar.gotoTransfer();
});

When(
  'user transfers {string} from account {string} to account {string}',
  async function (this: V4World, amount: string, from: string, to: string) {
    await this.transfer.transfer(amount, from, to);
  },
);

Then(
  'the transfer receipt shows {string} from {string} to {string}',
  async function (this: V4World, amount: string, from: string, to: string) {
    await expectTransferReceipt(this.page, amount, from, to);
  },
);

Then('the transfer form shows {string}', async function (this: V4World, message: string) {
  await expect(this.page.locator('#showForm').getByText(message, { exact: true })).toBeVisible();
});
