import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { TransferFormComponent } from '../components/TransferFormComponent';

export class TransferPage extends BasePage {
  private readonly transferForm: TransferFormComponent;

  constructor(page: Page) {
    super(page);
    // Transfer form is identified by id="transferForm" in the HTML
    this.transferForm = new TransferFormComponent(page, page.locator('#transferForm'));
  }

  get form(): TransferFormComponent {
    return this.transferForm;
  }

  get amountInput(): Locator {
    return this.transferForm.amountInput;
  }

  get fromAccountSelect(): Locator {
    return this.transferForm.fromAccountSelect;
  }

  get toAccountSelect(): Locator {
    return this.transferForm.toAccountSelect;
  }

  get submitButton(): Locator {
    return this.transferForm.submitButton;
  }

  async goto(path = '/parabank/transfer.htm'): Promise<void> {
    await super.goto(path);
  }

  async fillAmount(amount: string): Promise<void> {
    await this.transferForm.setAmount(amount);
  }

  async selectFromAccount(accountNumber: string): Promise<void> {
    await this.transferForm.selectFromAccount(accountNumber);
  }

  async selectToAccount(accountNumber: string): Promise<void> {
    await this.transferForm.selectToAccount(accountNumber);
  }

  async submitTransfer(): Promise<void> {
    await this.transferForm.submit();
  }
}
