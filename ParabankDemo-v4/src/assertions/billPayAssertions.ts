import { expect, type Page } from '@playwright/test';
import { formatUsdAmount } from '../support/money';

export async function expectBillPaymentSuccess(
  page: Page,
  expected: { payee: string; amount: string; fromAccount: string },
): Promise<void> {
  const receipt = page.locator('#billpayResult');
  await expect(receipt.getByRole('heading', { name: 'Bill Payment Complete' })).toBeVisible();
  await expect(receipt.locator('#payeeName')).toHaveText(expected.payee);
  await expect(receipt.locator('#amount')).toHaveText(formatUsdAmount(expected.amount));
  await expect(receipt.locator('#fromAccountId')).toHaveText(expected.fromAccount);
}

export async function expectBillPaymentError(page: Page, message: string): Promise<void> {
  await expect(page.locator('#billpayForm').getByText(message, { exact: true })).toBeVisible();
}
