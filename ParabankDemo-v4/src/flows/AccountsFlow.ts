import type { Page } from '@playwright/test';
import { BaseFlow } from './BaseFlow';
import { AccountsPage } from '../pages/AccountsPage';
import { NavbarComponent } from '../components/NavbarComponent';
import { savePageHtml } from '../support/debugUtils'

export class AccountsFlow extends BaseFlow {
  private readonly accountsPage: AccountsPage;
  private readonly navbar: NavbarComponent;

  constructor(page: Page) {
    super(page);
    this.accountsPage = new AccountsPage(page);
    this.navbar = NavbarComponent.create(page);
  }

  async viewAccountsOverview(): Promise<void> {
    await this.navbar.gotoAccounts();
    await this.accountsPage.waitUntilVisible(this.accountsPage.overviewTable);
  }

  async listAccountSummaries(): Promise<string[]> {
    await this.viewAccountsOverview();
    return this.accountsPage.getAccountRows();
  }

  async openAccountDetails(accountNumber: string): Promise<void> {
    await this.viewAccountsOverview();
    await this.accountsPage.openAccountDetails(accountNumber);
    await savePageHtml(this.page, 'account-details-page.html')
  }
}
