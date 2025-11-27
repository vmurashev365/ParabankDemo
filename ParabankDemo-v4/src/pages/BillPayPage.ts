import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { BillPayFormComponent, type PayeeDetails } from '../components/BillPayFormComponent';

export class BillPayPage extends BasePage {
  private readonly billPayForm: BillPayFormComponent;

  constructor(page: Page) {
    super(page);
    // Bill pay form lives inside the #billpayForm container; select the first form within
    this.billPayForm = new BillPayFormComponent(page, page.locator('#billpayForm form'));
  }

  get payeeNameInput(): Locator {
    return this.billPayForm.payeeNameInput;
  }

  get addressInput(): Locator {
    return this.billPayForm.addressInput;
  }

  get cityInput(): Locator {
    return this.billPayForm.cityInput;
  }

  get stateInput(): Locator {
    return this.billPayForm.stateInput;
  }

  get zipCodeInput(): Locator {
    return this.billPayForm.zipCodeInput;
  }

  get phoneInput(): Locator {
    return this.billPayForm.phoneInput;
  }

  get accountInput(): Locator {
    return this.billPayForm.accountInput;
  }

  get verifyAccountInput(): Locator {
    return this.billPayForm.verifyAccountInput;
  }

  get amountInput(): Locator {
    return this.billPayForm.amountInput;
  }

  get fromAccountSelect(): Locator {
    return this.billPayForm.fromAccountSelect;
  }

  get sendPaymentButton(): Locator {
    return this.billPayForm.submitButton;
  }

  get form(): BillPayFormComponent {
    return this.billPayForm;
  }

  async goto(path = 'https://parabank.parasoft.com/parabank/billpay.htm'): Promise<void> {
    await super.goto(path);
  }

  async fillPayeeDetails(details: PayeeDetails): Promise<void> {
    await this.billPayForm.fillPayeeDetails(details);
  }

  async setAmount(amount: string): Promise<void> {
    await this.billPayForm.setAmount(amount);
  }

  async selectFromAccount(accountNumber: string): Promise<void> {
    await this.billPayForm.selectFromAccount(accountNumber);
  }

  async submitPayment(): Promise<void> {
    await this.billPayForm.submit();
  }
}
