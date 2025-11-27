import type { Page } from '@playwright/test';
import { BaseFlow } from './BaseFlow';
import { BillPayPage } from '../pages/BillPayPage';
import { NavbarComponent } from '../components/NavbarComponent';
import type { PayeeDetails } from '../components/BillPayFormComponent';
import { savePageHtml } from '../support/debugUtils';

export class BillPayFlow extends BaseFlow {
  private readonly billPayPage: BillPayPage;
  private readonly navbar: NavbarComponent;

  constructor(page: Page) {
    super(page);
    this.billPayPage = new BillPayPage(page);
    this.navbar = NavbarComponent.create(page);
  }

  async openBillPayPage(): Promise<void> {
    await this.navbar.gotoBillPay();
    await savePageHtml(this.page, 'billpay-page.html');
    await this.billPayPage.waitUntilVisible(this.billPayPage.payeeNameInput);
  }

  async payBill(details: PayeeDetails, amount: string, fromAccount: string): Promise<void> {
    await this.openBillPayPage();
    await this.billPayPage.fillPayeeDetails(details);
    await this.billPayPage.setAmount(amount);
    await this.billPayPage.selectFromAccount(fromAccount);
    await this.billPayPage.submitPayment();
  }
}
