import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get accountsOverviewTable(): Locator {
    // ParaBank uses a table with id "accountTable" for the overview
    return this.page.locator('#accountTable');
  }

  get accountRows(): Locator {
    return this.accountsOverviewTable.getByRole('row');
  }

  get accountLinks(): Locator {
    return this.page.getByRole('link', { name: /\d{4,}/ });
  }

  get overviewTable(): Locator {
    return this.accountsOverviewTable;
  }

  async goto(path = '/parabank/overview.htm'): Promise<void> {
    await super.goto(path);
  }

  async getAccountRows(): Promise<string[]> {
    return this.accountRows.allTextContents();
  }

  async openAccountDetails(accountNumber: string): Promise<void> {
    const target = new RegExp(accountNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    await this.page.getByRole('link', { name: target }).click();
  }
}
