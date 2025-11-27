import type { Page } from '@playwright/test';
import { BaseFlow } from './BaseFlow';
import { LoginPage } from '../pages/LoginPage';
import { TransferPage } from '../pages/TransferPage';
import { NavbarComponent } from '../components/NavbarComponent';
import { TransferFormComponent } from '../components/TransferFormComponent';
import { savePageHtml } from '../support/debugUtils';

export class TransferFlow extends BaseFlow {
  private readonly loginPage: LoginPage;
  private readonly transferPage: TransferPage;
  private readonly navbar: NavbarComponent;

  constructor(page: Page) {
    super(page);
    this.loginPage = new LoginPage(page);
    this.transferPage = new TransferPage(page);
    this.navbar = NavbarComponent.create(page);
  }

  async openTransferPage(): Promise<void> {
    await this.ensureTransferFormReady();
  }

  async performTransfer(amount: string, fromLabel?: string, toLabel?: string): Promise<void> {
    const form = await this.ensureTransferFormReady();
    await form.setAmount(amount);
    if (fromLabel) {
      await form.selectFromAccount(fromLabel);
    }
    if (toLabel) {
      await form.selectToAccount(toLabel);
    }
    await form.submit();
  }

  async performTransferExpectingError(amount: string): Promise<void> {
    const form = await this.ensureTransferFormReady();
    await form.setAmount(amount);
    await form.submit();
  }

  private async ensureTransferFormReady(): Promise<TransferFormComponent> {
    await this.loginPage.waitUntilVisible(this.navbar.container);
    await this.navbar.gotoTransfer();
    await savePageHtml(this.page, 'transfer-page.html');
    await this.transferPage.waitUntilVisible(this.transferPage.amountInput);
    return this.transferPage.form;
  }
}
