import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { AccountsFilterComponent } from '../components/AccountsFilterComponent';
import { TransactionsTableComponent } from '../components/TransactionsTableComponent';

export class FindTransactionsPage extends BasePage {
  private readonly filterComponent: AccountsFilterComponent;
  private readonly tableComponent: TransactionsTableComponent;

  constructor(page: Page) {
    super(page);
    this.filterComponent = new AccountsFilterComponent(page, page.locator('form[action*="findtrans"]'));
    this.tableComponent = new TransactionsTableComponent(page, page.getByRole('table', { name: /transaction/i }));
  }

  get accountSelect(): Locator {
    return this.filterComponent.accountSelect;
  }

  get transactionIdInput(): Locator {
    return this.filterComponent.transactionIdInput;
  }

  get dateInput(): Locator {
    return this.filterComponent.dateInput;
  }

  get fromDateInput(): Locator {
    return this.filterComponent.fromDateInput;
  }

  get toDateInput(): Locator {
    return this.filterComponent.toDateInput;
  }

  get amountInput(): Locator {
    return this.filterComponent.amountInput;
  }

  get resultsTable(): TransactionsTableComponent {
    return this.tableComponent;
  }

  async goto(path = 'https://parabank.parasoft.com/parabank/findtrans.htm'): Promise<void> {
    await super.goto(path);
  }

  async selectAccount(accountNumber: string): Promise<void> {
    await this.filterComponent.selectAccount(accountNumber);
  }

  async searchByTransactionId(transactionId: string): Promise<void> {
    await this.filterComponent.searchByTransactionId(transactionId);
  }

  async searchByDate(date: string): Promise<void> {
    await this.filterComponent.searchByDate(date);
  }

  async searchByDateRange(from: string, to: string): Promise<void> {
    await this.filterComponent.searchByDateRange(from, to);
  }

  async searchByAmount(amount: string): Promise<void> {
    await this.filterComponent.searchByAmount(amount);
  }
}
