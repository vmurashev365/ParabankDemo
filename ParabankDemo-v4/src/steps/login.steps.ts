import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { expectVisible, expectTextContains } from '../assertions/uiAssertions';
import { clearAuthenticationCache, ensureAuthenticated, getLoginFlow } from './stepHelpers';

const getLoginPage = (world: any): LoginPage => world.loginPage ?? (world.loginPage = new LoginPage(world.page));

Given('user is on the login page', async function () {
  clearAuthenticationCache(this);
  await getLoginFlow(this).openLoginPage();
});

Given('user is authenticated with default credentials', async function () {
  await ensureAuthenticated(this);
});

Given('user is authenticated as {string} with password {string}', async function (username: string, password: string) {
  await ensureAuthenticated(this, username, password);
});

When('user logs in with default credentials', async function () {
  await ensureAuthenticated(this);
});

When('user logs in as {string} with password {string}', async function (username: string, password: string) {
  await ensureAuthenticated(this, username, password);
});

When('user attempts to login with username {string} and password {string}', async function (username: string, password: string) {
  clearAuthenticationCache(this);
  const loginPage = getLoginPage(this);
  await loginPage.goto();
  await loginPage.login(username, password);
});

Then('user should be logged in successfully', async function () {
  await expectVisible(getLoginFlow(this).navigationLocator, 'Navigation menu should be visible');
});

Then('user should see login error message {string}', async function (message: string) {
  const errorLocator = this.page.locator('.error').first();
  await expectTextContains(errorLocator, message);
});

Then('user should remain on the login page', async function () {
  await expect(this.page).toHaveURL(/login\.htm/i);
});
