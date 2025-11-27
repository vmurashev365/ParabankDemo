import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function expectBillPaymentSuccess(page: Page): Promise<void> {
  await expect(page.getByText(/bill payment complete|payment successful/i)).toBeVisible();
}

export async function expectBillPaymentError(page: Page): Promise<void> {
  // For negative bill pay, we expect validation errors, not internal server errors
  await expect(page.locator('#validationModel-amount-empty')).toBeVisible();
}
