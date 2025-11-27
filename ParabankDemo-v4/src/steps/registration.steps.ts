import { Given, When, Then, type DataTable } from '@cucumber/cucumber';
import { RegistrationFlow } from '../flows/RegistrationFlow';
import type { RegistrationData } from '../pages/RegisterPage';
import { expectRegistrationSuccess, expectValidationError } from '../assertions/registrationAssertions';

const getRegistrationFlow = (world: any): RegistrationFlow =>
  world.registrationFlow ?? (world.registrationFlow = new RegistrationFlow(world.page));

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
  confirmPassword: 'SecurePass123!'
};

const normalizeKeys = (table?: DataTable): Record<string, string> => {
  if (!table) {
    return {};
  }
  const raw = table.rowsHash();
  return Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key.replace(/\s+/g, '').toLowerCase(), value])
  );
};

const uniqueSuffix = () => Date.now().toString(36);

const buildRegistrationData = (table?: DataTable): RegistrationData => {
  const overrides = normalizeKeys(table);
  const data: RegistrationData = {
    firstName: overrides.firstname ?? defaultRegistrationData.firstName,
    lastName: overrides.lastname ?? defaultRegistrationData.lastName,
    address: overrides.address ?? defaultRegistrationData.address,
    city: overrides.city ?? defaultRegistrationData.city,
    state: overrides.state ?? defaultRegistrationData.state,
    zipCode: overrides.zipcode ?? overrides.zip ?? defaultRegistrationData.zipCode,
    phone: overrides.phone ?? defaultRegistrationData.phone,
    ssn: overrides.ssn ?? defaultRegistrationData.ssn,
    username: overrides.username ?? `${defaultRegistrationData.username}_${uniqueSuffix()}`,
    password: overrides.password ?? defaultRegistrationData.password,
    confirmPassword: overrides.confirmpassword ?? overrides.password ?? defaultRegistrationData.confirmPassword
  };

  if (!overrides.username && data.username === defaultRegistrationData.username) {
    data.username = `${data.username}_${uniqueSuffix()}`;
  }

  return data;
};

Given('user is on the registration page', async function () {
  await getRegistrationFlow(this).openRegistrationPage();
});

When('user registers with default data', async function () {
  const data = buildRegistrationData();
  await getRegistrationFlow(this).registerNewCustomer(data);
  this.registeredUser = data;
});

When('user registers with the following details:', async function (table: DataTable) {
  const data = buildRegistrationData(table);
  await getRegistrationFlow(this).registerNewCustomer(data);
  this.registeredUser = data;
});

Then('registration should succeed', async function () {
  await expectRegistrationSuccess(this.page);
});

Then('registration should fail with validation message {string}', async function (message: string) {
  await expectValidationError(this.page, message);
});
