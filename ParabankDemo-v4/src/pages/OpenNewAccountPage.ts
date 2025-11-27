import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OpenNewAccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get accountTypeSelect(): Locator {
    return this.page.getByLabel(/account type/i);
  }

  get fundingAccountSelect(): Locator {
    return this.page.getByLabel(/existing account/i);
  }

  get openAccountButton(): Locator {
    return this.page.getByRole('button', { name: /open new account/i });
  }

  async goto(path = 'https://parabank.parasoft.com/parabank/openaccount.htm'): Promise<void> {
    await super.goto(path);
  }

  async chooseAccountType(type: string): Promise<void> {
    await this.accountTypeSelect.selectOption(type);
  }

  async chooseFundingAccount(accountNumber: string): Promise<void> {
    await this.fundingAccountSelect.selectOption(accountNumber);
  }

  async openNewAccount(type: string, fundingAccount: string): Promise<void> {
    await this.chooseAccountType(type);
    await this.chooseFundingAccount(fundingAccount);
    await this.openAccountButton.click();
  }
}
