import { Given, When, Then } from '@cucumber/cucumber';
import { TransferFlow } from '../flows/TransferFlow';
import { expectTransferError, expectTransferSuccess } from '../assertions/transferAssertions';
import { ensureAuthenticated } from './stepHelpers';
import { expectTextContains } from '../assertions/uiAssertions';

const getTransferFlow = (world: any): TransferFlow => world.transferFlow ?? (world.transferFlow = new TransferFlow(world.page));

Given('user is logged in', async function () {
  await ensureAuthenticated(this);
});

Given('user is logged in as {string} with password {string}', async function (username: string, password: string) {
  await ensureAuthenticated(this, username, password);
});

Given('user is on the transfer page', async function () {
  await ensureAuthenticated(this);
  await getTransferFlow(this).openTransferPage();
});

When('user transfers {string} between accounts', async function (amount: string) {
  await getTransferFlow(this).performTransfer(amount);
});

When('user transfers {string} from account {string} to account {string}', async function (
  amount: string,
  fromAccount: string,
  toAccount: string
) {
  await getTransferFlow(this).performTransfer(amount, fromAccount, toAccount);
});

Then('transfer should be successful', async function () {
  await expectTransferSuccess(this.page);
});

Then('transfer success message {string} should be displayed', async function (message: string) {
  await expectTransferSuccess(this.page);
  await expectTextContains(this.page.locator('body'), message);
});

When('user transfers {string} above balance', async function (amount: string) {
  await getTransferFlow(this).performTransferExpectingError(amount);
});

Then('an error message should be shown', async function () {
  await expectTransferError(this.page);
});

Then('transfer should fail with message {string}', async function (message: string) {
  await expectTransferError(this.page);
  await expectTextContains(this.page.locator('body'), message);
});
