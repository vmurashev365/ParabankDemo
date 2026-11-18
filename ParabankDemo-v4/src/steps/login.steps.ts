import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { V4World } from '../support/world';
import { defaultPassword, defaultUsername, signIn } from './stepHelpers';

Given('user is on the login page', async function (this: V4World) {
  await this.login.goto();
});

Given('user is authenticated with default credentials', async function (this: V4World) {
  await signIn(this);
});

Given(
  'user is authenticated as {string} with password {string}',
  async function (this: V4World, username: string, password: string) {
    await signIn(this, username, password);
  },
);

When('user logs in with default credentials', async function (this: V4World) {
  await this.login.login(defaultUsername, defaultPassword);
});

When(
  'user logs in as {string} with password {string}',
  async function (this: V4World, username: string, password: string) {
    await this.login.login(username, password);
  },
);

When(
  'user attempts to login with username {string} and password {string}',
  async function (this: V4World, username: string, password: string) {
    await this.login.login(username, password);
  },
);

Then('user should be logged in successfully', async function (this: V4World) {
  await expect(this.navbar.logoutLink).toBeVisible();
});

Then('user should see login error message {string}', async function (this: V4World, message: string) {
  await expect(this.page.getByText(message, { exact: true })).toBeVisible();
});

Then('user should remain on the login page', async function (this: V4World) {
  await expect(this.page).toHaveURL(/login\.htm/i);
  await expect(this.login.submitButton).toBeVisible();
});
