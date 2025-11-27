import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { NavbarComponent } from '../components/NavbarComponent';
import { ensureAuthenticated, clearAuthenticationCache } from './stepHelpers';
import { expectAccountOverviewVisible } from '../assertions/accountAssertions';

const getNavbar = (world: any): NavbarComponent => {
  if (!world.page) {
    throw new Error('Playwright page instance is not available on the World context.');
  }
  return world.navbar ?? (world.navbar = NavbarComponent.create(world.page));
};

Given('user has access to the main navigation', async function () {
  await ensureAuthenticated(this);
  await expect(getNavbar(this).container).toBeVisible();
});

When('user navigates to the {string} page via the navbar', async function (destination: string) {
  await ensureAuthenticated(this);
  const navbar = getNavbar(this);
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
    clearAuthenticationCache(this);
    return;
  }

  throw new Error(`Unknown navigation destination: ${destination}`);
});

When('user logs out via the navbar', async function () {
  await ensureAuthenticated(this);
  await getNavbar(this).logout();
  clearAuthenticationCache(this);
});

Then('accounts overview page should be displayed', async function () {
  await expectAccountOverviewVisible(this.page);
});

Then('user should see the login page again', async function () {
  await expect(this.page).toHaveURL(/index\.htm/i);
});
