import type { Locator, Page } from '@playwright/test';
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

  get firstNameInput(): Locator {
    return this.formComponent.firstNameInput;
  }

  get lastNameInput(): Locator {
    return this.formComponent.lastNameInput;
  }

  get addressInput(): Locator {
    return this.page.getByLabel(/address/i);
  }

  get cityInput(): Locator {
    return this.page.getByLabel(/city/i);
  }

  get stateInput(): Locator {
    return this.page.getByLabel(/state/i);
  }

  get zipCodeInput(): Locator {
    return this.page.getByLabel(/zip code/i);
  }

  get phoneInput(): Locator {
    return this.page.getByLabel(/phone/i);
  }

  get ssnInput(): Locator {
    return this.page.getByLabel(/ssn/i);
  }

  get usernameInput(): Locator {
    return this.page.getByLabel(/username/i);
  }

  get passwordInput(): Locator {
    return this.page.getByLabel(/^password$/i);
  }

  get confirmPasswordInput(): Locator {
    return this.page.getByLabel(/confirm password/i);
  }

  get registerButton(): Locator {
    return this.formComponent.submitButton;
  }

  async goto(path = 'https://parabank.parasoft.com/parabank/register.htm'): Promise<void> {
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
