import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class AccountsFilterComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  get accountSelect(): Locator {
    return this.root.getByLabel(/account/i);
  }

  get transactionIdInput(): Locator {
    return this.root.getByLabel(/transaction id/i);
  }

  get dateInput(): Locator {
    return this.root.getByLabel(/^date$/i);
  }

  get fromDateInput(): Locator {
    return this.root.getByLabel(/from date/i);
  }

  get toDateInput(): Locator {
    return this.root.getByLabel(/to date/i);
  }

  get amountInput(): Locator {
    return this.root.getByLabel(/amount/i);
  }

  get findByIdButton(): Locator {
    return this.root.getByRole('button', { name: /find by id/i });
  }

  get findByDateButton(): Locator {
    return this.root.getByRole('button', { name: /find by date/i });
  }

  get findByAmountButton(): Locator {
    return this.root.getByRole('button', { name: /find by amount/i });
  }

  async selectAccount(accountNumber: string): Promise<void> {
    await this.accountSelect.selectOption(accountNumber);
  }

  async searchByTransactionId(id: string): Promise<void> {
    await this.transactionIdInput.fill(id);
    await this.findByIdButton.click();
  }

  async searchByDate(date: string): Promise<void> {
    await this.dateInput.fill(date);
    await this.findByDateButton.click();
  }

  async searchByDateRange(from: string, to: string): Promise<void> {
    await this.fromDateInput.fill(from);
    await this.toDateInput.fill(to);
    await this.findByDateButton.click();
  }

  async searchByAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
    await this.findByAmountButton.click();
  }
}
