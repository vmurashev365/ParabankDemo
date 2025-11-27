import { Given, When, Then, type DataTable } from '@cucumber/cucumber';
import { BillPayFlow } from '../flows/BillPayFlow';
import type { PayeeDetails } from '../components/BillPayFormComponent';
import { expectBillPaymentError, expectBillPaymentSuccess } from '../assertions/billPayAssertions';
import { ensureAuthenticated } from './stepHelpers';
import { expectTextContains } from '../assertions/uiAssertions';

const getBillPayFlow = (world: any): BillPayFlow =>
  world.billPayFlow ?? (world.billPayFlow = new BillPayFlow(world.page));

const defaultPayee: PayeeDetails = {
  name: 'Utility Company',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  phone: '5551234567',
  account: '12345678',
  verifyAccount: '12345678'
};

const normalizeTable = (table?: DataTable): Record<string, string> => {
  if (!table) {
    return {};
  }

  const raw = table.rowsHash();
  return Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key.replace(/\s+/g, '').toLowerCase(), value])
  );
};

const buildPayeeDetails = (data: Record<string, string>): PayeeDetails => ({
  name: data.name ?? defaultPayee.name,
  address: data.address ?? defaultPayee.address,
  city: data.city ?? defaultPayee.city,
  state: data.state ?? defaultPayee.state,
  zipCode: data.zipcode ?? data.zip ?? defaultPayee.zipCode,
  phone: data.phone ?? defaultPayee.phone,
  account: data.account ?? defaultPayee.account,
  verifyAccount: data.verifyaccount ?? defaultPayee.verifyAccount
});

Given('user is on the bill pay page', async function () {
  await ensureAuthenticated(this);
  await getBillPayFlow(this).openBillPayPage();
});

When('user pays a bill with the following details:', async function (table: DataTable) {
  await ensureAuthenticated(this);
  const normalized = normalizeTable(table);
  const payee = buildPayeeDetails(normalized);
  const amount = normalized.amount ?? '25.00';
  const fromAccount = normalized.fromaccount ?? normalized.from ?? '13344';
  await getBillPayFlow(this).payBill(payee, amount, fromAccount);
});

When('user pays a bill of {string} to {string} from account {string}', async function (
  amount: string,
  payeeName: string,
  fromAccount: string
) {
  await ensureAuthenticated(this);
  const payee: PayeeDetails = {
    ...defaultPayee,
    name: payeeName,
    account: defaultPayee.account,
    verifyAccount: defaultPayee.verifyAccount
  };
  await getBillPayFlow(this).payBill(payee, amount, fromAccount);
});

Then('bill payment should be successful', async function () {
  await expectBillPaymentSuccess(this.page);
});

Then('bill payment should fail', async function () {
  await expectBillPaymentError(this.page);
});

Then('bill payment should fail with message {string}', async function (message: string) {
  await expectBillPaymentError(this.page);
  await expectTextContains(this.page.locator('body'), message);
});
