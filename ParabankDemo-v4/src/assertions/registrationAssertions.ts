import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function expectRegistrationSuccess(page: Page): Promise<void> {
  // ParaBank shows a bold "Welcome" followed by a personalized heading
  await expect(page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();
}

export async function expectValidationError(page: Page, message: string): Promise<void> {
  await expect(page.getByText(new RegExp(message, 'i'))).toBeVisible();
}
