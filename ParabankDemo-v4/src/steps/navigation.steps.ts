import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { V4World } from '../support/world';
import { signIn } from './stepHelpers';
import { expectAccountOverviewVisible } from '../assertions/accountAssertions';

Given('user has access to the main navigation', async function (this: V4World) {
  await signIn(this);
  await expect(this.navbar.container).toBeVisible();
});

When('user navigates to the {string} page via the navbar', async function (this: V4World, destination: string) {
  const navbar = this.navbar;
  const target = destination.trim().toLowerCase();

  if (target === 'accounts' || target === 'accounts overview') {
    await navbar.gotoAccounts();
    return;
  }

  if (target === 'transfer' || target === 'transfer funds') {
    await navbar.gotoTransfer();
    return;
  }

  if (target === 'bill pay' || target === 'bill payment') {
    await navbar.gotoBillPay();
    return;
  }

  if (target === 'logout' || target === 'log out') {
    await navbar.logout();
    return;
  }

  throw new Error(`Unknown navigation destination: ${destination}`);
});

When('user logs out via the navbar', async function (this: V4World) {
  await this.navbar.logout();
});

Then('accounts overview page should be displayed', async function (this: V4World) {
  await expectAccountOverviewVisible(this.page);
});

Then('user should see the login page again', async function (this: V4World) {
  await expect(this.page).toHaveURL(/index\.htm/i);
});
