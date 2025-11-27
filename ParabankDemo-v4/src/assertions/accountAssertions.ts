import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function expectAccountOverviewVisible(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
  await expect(page.locator('#accountTable')).toBeVisible();
}

export async function expectAccountDetailsVisible(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: 'Account Details' })).toBeVisible();
  await expect(page.locator('#transactionTable')).toBeVisible();
}
