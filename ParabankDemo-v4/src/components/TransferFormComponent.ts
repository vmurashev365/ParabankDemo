import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class TransferFormComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  get amountInput(): Locator {
    // HTML uses id="amount" and name="input" for the amount field
    return this.root.locator('input#amount');
  }

  get fromAccountSelect(): Locator {
    // From/to account selects are identified by id, not name
    return this.root.locator('select#fromAccountId');
  }

  get toAccountSelect(): Locator {
    return this.root.locator('select#toAccountId');
  }

  get submitButton(): Locator {
    return this.root.locator('input[type="submit"][value="Transfer"]');
  }

  async setAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async selectFromAccount(accountNumber: string): Promise<void> {
    await this.fromAccountSelect.selectOption(accountNumber);
  }

  async selectToAccount(accountNumber: string): Promise<void> {
    await this.toAccountSelect.selectOption(accountNumber);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
