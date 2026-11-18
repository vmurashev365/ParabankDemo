import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { BillPayFormComponent, type PayeeDetails } from '../components/BillPayFormComponent';

export class BillPayPage extends BasePage {
  private readonly form: BillPayFormComponent;

  constructor(page: Page) {
    super(page);
    this.form = new BillPayFormComponent(page, page.locator('#billpayForm form'));
  }

  async goto(path = '/parabank/billpay.htm'): Promise<void> {
    await super.goto(path);
  }

  async payBill(details: PayeeDetails, amount: string, fromAccount: string): Promise<void> {
    await this.form.fillPayeeDetails(details);
    await this.form.setAmount(amount);
    await this.form.selectFromAccount(fromAccount);
    await this.form.submit();
  }
}
