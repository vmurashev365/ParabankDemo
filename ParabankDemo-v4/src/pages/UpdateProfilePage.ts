import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type ProfileData = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
};

export class UpdateProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get firstNameInput(): Locator {
    return this.page.getByLabel(/first name/i);
  }

  get lastNameInput(): Locator {
    return this.page.getByLabel(/last name/i);
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

  get updateProfileButton(): Locator {
    return this.page.getByRole('button', { name: /update profile|update contact/i });
  }

  async goto(path = 'https://parabank.parasoft.com/parabank/updateprofile.htm'): Promise<void> {
    await super.goto(path);
  }

  async updateProfile(data: ProfileData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipCodeInput.fill(data.zipCode);
    await this.phoneInput.fill(data.phone);
    await this.updateProfileButton.click();
  }
}
