import { Given, When, Then, type DataTable } from '@cucumber/cucumber';
import type { V4World } from '../support/world';
import { randomUUID } from 'node:crypto';
import type { RegistrationData } from '../pages/RegisterPage';
import { expectRegistrationSuccess, expectValidationError } from '../assertions/registrationAssertions';

const defaultRegistrationData: RegistrationData = {
  firstName: 'Jane',
  lastName: 'Doe',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  phone: '5551234567',
  ssn: '123-45-6789',
  username: 'autouser',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
};

const normalizeKeys = (table?: DataTable): Record<string, string> => {
  if (!table) {
    return {};
  }
  const raw = table.rowsHash();
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key.replace(/\s+/g, '').toLowerCase(), value]));
};

const buildRegistrationData = (table?: DataTable): RegistrationData => {
  const overrides = normalizeKeys(table);
  return {
    firstName: overrides.firstname ?? defaultRegistrationData.firstName,
    lastName: overrides.lastname ?? defaultRegistrationData.lastName,
    address: overrides.address ?? defaultRegistrationData.address,
    city: overrides.city ?? defaultRegistrationData.city,
    state: overrides.state ?? defaultRegistrationData.state,
    zipCode: overrides.zipcode ?? overrides.zip ?? defaultRegistrationData.zipCode,
    phone: overrides.phone ?? defaultRegistrationData.phone,
    ssn: overrides.ssn ?? defaultRegistrationData.ssn,
    username: overrides.username ?? `${defaultRegistrationData.username}_${randomUUID().slice(0, 8)}`,
    password: overrides.password ?? defaultRegistrationData.password,
    confirmPassword: overrides.confirmpassword ?? overrides.password ?? defaultRegistrationData.confirmPassword,
  };
};

Given('user is on the registration page', async function (this: V4World) {
  await this.registration.goto();
});

When('user registers with default data', async function (this: V4World) {
  const data = buildRegistrationData();
  await this.registration.register(data);
});

When('user registers with the following details:', async function (this: V4World, table: DataTable) {
  const data = buildRegistrationData(table);
  await this.registration.register(data);
});

Then('registration should succeed', async function (this: V4World) {
  await expectRegistrationSuccess(this.page);
});

Then('registration should fail with validation message {string}', async function (this: V4World, message: string) {
  await expectValidationError(this.page, message);
});
