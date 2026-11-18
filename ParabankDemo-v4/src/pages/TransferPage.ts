import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { TransferFormComponent } from '../components/TransferFormComponent';

export class TransferPage extends BasePage {
  private readonly form: TransferFormComponent;

  constructor(page: Page) {
    super(page);
    this.form = new TransferFormComponent(page, page.locator('#transferForm'));
  }

  async goto(path = '/parabank/transfer.htm'): Promise<void> {
    await super.goto(path);
  }

  async transfer(amount: string, from: string, to: string): Promise<void> {
    await this.form.selectFromAccount(from);
    await this.form.selectToAccount(to);
    await this.form.setAmount(amount);
    await this.form.submit();
  }
}
