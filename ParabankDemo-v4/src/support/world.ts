import { setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, firefox, webkit, type Browser, type Page } from '@playwright/test';
import { AccountsPage } from '../pages/AccountsPage';
import { BillPayPage } from '../pages/BillPayPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TransferPage } from '../pages/TransferPage';
import { NavbarComponent } from '../components/NavbarComponent';

interface BrowserSettings {
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
}

export class V4World extends World<BrowserSettings> {
  private browser?: Browser;
  page!: Page;
  accounts!: AccountsPage;
  billPay!: BillPayPage;
  login!: LoginPage;
  registration!: RegisterPage;
  transfer!: TransferPage;
  navbar!: NavbarComponent;

  balancesBefore = new Map<string, number>();
  payment?: { payee: string; amount: string; fromAccount: string };

  async initPage(): Promise<void> {
    const browserType = { chromium, firefox, webkit }[this.parameters.browser];
    if (!browserType) throw new Error(`Unknown PARABANK_BROWSER: ${this.parameters.browser}`);
    this.browser = await browserType.launch({ headless: this.parameters.headless });
    this.page = await this.browser.newPage();
    this.accounts = new AccountsPage(this.page);
    this.billPay = new BillPayPage(this.page);
    this.login = new LoginPage(this.page);
    this.registration = new RegisterPage(this.page);
    this.transfer = new TransferPage(this.page);
    this.navbar = NavbarComponent.create(this.page);
  }

  async cleanup(): Promise<void> {
    await this.browser?.close();
  }
}

setWorldConstructor(V4World);
setDefaultTimeout(30_000);
