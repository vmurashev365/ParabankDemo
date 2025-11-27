import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export async function expectVisible(locator: Locator, message?: string): Promise<void> {
  await expect(locator, message).toBeVisible();
}

export async function expectTextContains(locator: Locator, text: string): Promise<void> {
  await expect(locator).toContainText(text);
}
