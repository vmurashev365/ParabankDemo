import type { Locator, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NavbarComponent } from '../components/NavbarComponent';
import { BaseFlow } from './BaseFlow';

export class LoginFlow extends BaseFlow {
  private readonly loginPage: LoginPage;
  private readonly navbar: NavbarComponent;

  constructor(page: Page) {
    super(page);
    this.loginPage = new LoginPage(page);
    this.navbar = NavbarComponent.create(page);
  }

  async openLoginPage(): Promise<void> {
    await this.loginPage.goto();
  }

  async loginWithCredentials(username: string, password: string): Promise<void> {
    await this.openLoginPage();
    await this.loginPage.login(username, password);
    await this.navbar.gotoAccounts();
  }

  get navigationLocator(): Locator {
    return this.navbar.container;
  }
}
