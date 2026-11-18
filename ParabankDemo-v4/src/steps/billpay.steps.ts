import { Given, When, Then, type DataTable } from '@cucumber/cucumber';
import type { V4World } from '../support/world';
import type { PayeeDetails } from '../components/BillPayFormComponent';
import { expectBillPaymentError, expectBillPaymentSuccess } from '../assertions/billPayAssertions';
import { signIn } from './stepHelpers';

const defaultPayee: PayeeDetails = {
  name: 'Utility Company',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  phone: '5551234567',
  account: '12345678',
  verifyAccount: '12345678',
};

const normalizeTable = (table?: DataTable): Record<string, string> => {
  if (!table) {
    return {};
  }

  const raw = table.rowsHash();
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key.replace(/\s+/g, '').toLowerCase(), value]));
};

const buildPayeeDetails = (data: Record<string, string>): PayeeDetails => ({
  name: data.name ?? defaultPayee.name,
  address: data.address ?? defaultPayee.address,
  city: data.city ?? defaultPayee.city,
  state: data.state ?? defaultPayee.state,
  zipCode: data.zipcode ?? data.zip ?? defaultPayee.zipCode,
  phone: data.phone ?? defaultPayee.phone,
  account: data.account ?? defaultPayee.account,
  verifyAccount: data.verifyaccount ?? defaultPayee.verifyAccount,
});

Given('user is on the bill pay page', async function (this: V4World) {
  await signIn(this);
  await this.navbar.gotoBillPay();
});

When('user pays a bill with the following details:', async function (this: V4World, table: DataTable) {
  const normalized = normalizeTable(table);
  const payee = buildPayeeDetails(normalized);
  const amount = normalized.amount ?? '25.00';
  const fromAccount = normalized.fromaccount ?? normalized.from ?? '13344';
  this.payment = { payee: payee.name, amount, fromAccount };
  await this.billPay.payBill(payee, amount, fromAccount);
});

When(
  'user pays a bill of {string} to {string} from account {string}',
  async function (this: V4World, amount: string, payeeName: string, fromAccount: string) {
    const payee: PayeeDetails = {
      ...defaultPayee,
      name: payeeName,
      account: defaultPayee.account,
      verifyAccount: defaultPayee.verifyAccount,
    };
    this.payment = { payee: payee.name, amount, fromAccount };
    await this.billPay.payBill(payee, amount, fromAccount);
  },
);

Then('bill payment should be successful', async function (this: V4World) {
  if (!this.payment) throw new Error('Submit a bill before checking its receipt.');
  await expectBillPaymentSuccess(this.page, this.payment);
});

Then('bill payment should fail with message {string}', async function (this: V4World, message: string) {
  await expectBillPaymentError(this.page, message);
});
