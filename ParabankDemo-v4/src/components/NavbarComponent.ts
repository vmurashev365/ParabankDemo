import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class NavbarComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  static create(page: Page): NavbarComponent {
    // ParaBank uses a left-side panel with id "leftPanel" for navigation
    // rather than a semantic <nav> element, so we target it directly.
    return new NavbarComponent(page, page.locator('#leftPanel'));
  }

  private get accountsOverviewLink(): Locator {
    // Matches the "Accounts Overview" link in the Account Services menu
    return this.root.locator('a[href*="overview.htm"]');
  }

  private get transferFundsLink(): Locator {
    // Matches the "Transfer Funds" link
    return this.root.locator('a[href*="transfer.htm"]');
  }

  private get billPayLink(): Locator {
    // Matches the "Bill Pay" link
    return this.root.locator('a[href*="billpay.htm"]');
  }

  private get logoutLink(): Locator {
    // Matches the "Log Out" link
    return this.root.locator('a[href*="logout.htm"]');
  }

  get container(): Locator {
    return this.root;
  }

  async gotoAccounts(): Promise<void> {
    await this.accountsOverviewLink.click();
  }

  async gotoTransfer(): Promise<void> {
    await this.transferFundsLink.click();
  }

  async gotoBillPay(): Promise<void> {
    await this.billPayLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }
}
