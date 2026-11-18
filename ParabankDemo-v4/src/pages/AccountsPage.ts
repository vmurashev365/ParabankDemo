import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { usdToCents } from '../support/money';

export class AccountsPage extends BasePage {
  get overviewTable(): Locator {
    return this.page.locator('#accountTable');
  }

  get accountLinks(): Locator {
    return this.overviewTable.getByRole('link', { name: /^\d+$/ });
  }

  private accountLink(number: string): Locator {
    return this.overviewTable.getByRole('link', { name: number, exact: true });
  }

  async openAccountDetails(number: string): Promise<void> {
    await this.accountLink(number).click();
  }

  async balanceInCents(number: string): Promise<number> {
    const row = this.overviewTable
      .getByRole('row')
      .filter({ has: this.page.getByRole('link', { name: number, exact: true }) });
    // The header order is Account, Balance, Available Amount.
    return usdToCents(await row.getByRole('cell').nth(1).innerText());
  }
}
