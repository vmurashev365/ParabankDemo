import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export type PayeeDetails = {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  account: string;
  verifyAccount: string;
};

export class BillPayFormComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  get payeeNameInput(): Locator {
    return this.root.locator('input[name="payee.name"]');
  }

  get addressInput(): Locator {
    return this.root.locator('input[name="payee.address.street"]');
  }

  get cityInput(): Locator {
    return this.root.locator('input[name="payee.address.city"]');
  }

  get stateInput(): Locator {
    return this.root.locator('input[name="payee.address.state"]');
  }

  get zipCodeInput(): Locator {
    return this.root.locator('input[name="payee.address.zipCode"]');
  }

  get phoneInput(): Locator {
    return this.root.locator('input[name="payee.phoneNumber"]');
  }

  get accountInput(): Locator {
    return this.root.locator('input[name="payee.accountNumber"]');
  }

  get verifyAccountInput(): Locator {
    return this.root.locator('input[name="verifyAccount"]');
  }

  get amountInput(): Locator {
    return this.root.locator('input[name="amount"]');
  }

  get fromAccountSelect(): Locator {
    return this.root.locator('select[name="fromAccountId"]');
  }

  get submitButton(): Locator {
    return this.root.locator('input[value="Send Payment"]');
  }

  async fillPayeeDetails(details: PayeeDetails): Promise<void> {
    await this.payeeNameInput.fill(details.name);
    await this.addressInput.fill(details.address);
    await this.cityInput.fill(details.city);
    await this.stateInput.fill(details.state);
    await this.zipCodeInput.fill(details.zipCode);
    await this.phoneInput.fill(details.phone);
    await this.accountInput.fill(details.account);
    await this.verifyAccountInput.fill(details.verifyAccount);
  }

  async setAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async selectFromAccount(accountNumber: string): Promise<void> {
    await this.fromAccountSelect.selectOption(accountNumber);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
