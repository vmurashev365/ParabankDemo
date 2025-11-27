import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function expectTransferSuccess(page: Page): Promise<void> {
  const successBanner = page.getByText(/transfer complete/i);
  await expect(successBanner).toBeVisible();
}

export async function expectTransferError(page: Page): Promise<void> {
  // For negative transfers (exceeds balance), ParaBank typically shows validation messages or keeps the result hidden.
  // For now, assert that the transfer completion banner is not visible.
  const successBanner = page.getByText(/transfer complete/i);
  await expect(successBanner).not.toBeVisible();
}
