import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class TransactionsTableComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  get headerRow(): Locator {
    return this.root.getByRole('row').first();
  }

  get dataRows(): Locator {
    return this.root.getByRole('row').filter({ has: this.page.getByRole('cell') });
  }

  async getRowTexts(): Promise<string[]> {
    return this.dataRows.allTextContents();
  }

  async openTransactionByDescription(description: string): Promise<void> {
    await this.root.getByRole('link', { name: new RegExp(description, 'i') }).click();
  }
}
