import type { Page } from '@playwright/test';
import { BaseFlow } from './BaseFlow';
import { RegisterPage, type RegistrationData } from '../pages/RegisterPage';

export class RegistrationFlow extends BaseFlow {
  private readonly registerPage: RegisterPage;

  constructor(page: Page) {
    super(page);
    this.registerPage = new RegisterPage(page);
  }

  async openRegistrationPage(): Promise<void> {
    await this.registerPage.goto();
  }

  async registerNewCustomer(data: RegistrationData): Promise<void> {
    await this.openRegistrationPage();
    await this.registerPage.register(data);
  }
}
