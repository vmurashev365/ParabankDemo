import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';
import type { RegistrationData } from '../pages/RegisterPage';

export class RegistrationFormComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  get firstNameInput(): Locator {
    return this.root.locator('input[name="customer.firstName"]');
  }

  get lastNameInput(): Locator {
    return this.root.locator('input[name="customer.lastName"]');
  }

  get addressInput(): Locator {
    return this.root.locator('input[name="customer.address.street"]');
  }

  get cityInput(): Locator {
    return this.root.locator('input[name="customer.address.city"]');
  }

  get stateInput(): Locator {
    return this.root.locator('input[name="customer.address.state"]');
  }

  get zipCodeInput(): Locator {
    return this.root.locator('input[name="customer.address.zipCode"]');
  }

  get phoneInput(): Locator {
    return this.root.locator('input[name="customer.phoneNumber"]');
  }

  get ssnInput(): Locator {
    return this.root.locator('input[name="customer.ssn"]');
  }

  get usernameInput(): Locator {
    return this.root.locator('input[name="customer.username"]');
  }

  get passwordInput(): Locator {
    return this.root.locator('input[name="customer.password"]');
  }

  get confirmPasswordInput(): Locator {
    return this.root.locator('input[name="repeatedPassword"]');
  }

  get submitButton(): Locator {
    return this.root.locator('input[value="Register"]');
  }

  async fillForm(data: RegistrationData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipCodeInput.fill(data.zipCode);
    await this.phoneInput.fill(data.phone);
    await this.ssnInput.fill(data.ssn);
    await this.usernameInput.fill(data.username);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
