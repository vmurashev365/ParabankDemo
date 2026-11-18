import { expect, type Page } from '@playwright/test';

export async function expectTransferReceipt(page: Page, amount: string, from: string, to: string): Promise<void> {
  const receipt = page.locator('#showResult');
  await expect(receipt.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible();
  await expect(receipt.locator('#amountResult')).toHaveText(`$${Number(amount).toFixed(2)}`);
  await expect(receipt.locator('#fromAccountIdResult')).toHaveText(from);
  await expect(receipt.locator('#toAccountIdResult')).toHaveText(to);
}
