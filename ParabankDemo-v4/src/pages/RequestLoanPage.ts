import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RequestLoanPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get loanAmountInput(): Locator {
    return this.page.getByLabel(/loan amount/i);
  }

  get downPaymentInput(): Locator {
    return this.page.getByLabel(/down payment/i);
  }

  get fromAccountSelect(): Locator {
    return this.page.getByLabel(/from account/i);
  }

  get applyNowButton(): Locator {
    return this.page.getByRole('button', { name: /apply now/i });
  }

  async goto(path = 'https://parabank.parasoft.com/parabank/requestloan.htm'): Promise<void> {
    await super.goto(path);
  }

  async setLoanAmount(amount: string): Promise<void> {
    await this.loanAmountInput.fill(amount);
  }

  async setDownPayment(downPayment: string): Promise<void> {
    await this.downPaymentInput.fill(downPayment);
  }

  async selectFundingAccount(accountNumber: string): Promise<void> {
    await this.fromAccountSelect.selectOption(accountNumber);
  }

  async submitLoanRequest(amount: string, downPayment: string, accountNumber: string): Promise<void> {
    await this.setLoanAmount(amount);
    await this.setDownPayment(downPayment);
    await this.selectFundingAccount(accountNumber);
    await this.applyNowButton.click();
  }
}
