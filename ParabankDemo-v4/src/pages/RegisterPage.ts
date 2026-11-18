import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { RegistrationFormComponent } from '../components/RegistrationFormComponent';

export type RegistrationData = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export class RegisterPage extends BasePage {
  private readonly formComponent: RegistrationFormComponent;

  constructor(page: Page) {
    super(page);
    this.formComponent = new RegistrationFormComponent(page, page.locator('form[action*="register"]'));
  }

  async goto(path = '/parabank/register.htm'): Promise<void> {
    await super.goto(path);
  }

  async fillRegistrationForm(data: RegistrationData): Promise<void> {
    await this.formComponent.fillForm(data);
  }

  async submit(): Promise<void> {
    await this.formComponent.submit();
  }

  async register(data: RegistrationData): Promise<void> {
    await this.fillRegistrationForm(data);
    await this.submit();
  }
}
