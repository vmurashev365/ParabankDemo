import type { APIRequestContext } from '@playwright/test';
import { numberToCents } from '../support/money';

export interface CustomerDto {
  id: number;
  firstName: string;
  lastName: string;
}

export interface AccountDto {
  id: number;
  customerId: number;
  type: string;
  balance: number;
}

export interface TransactionDto {
  id: number;
  accountId: number;
  type: 'Debit' | 'Credit' | string;
  date: number | string;
  amount: number;
  description: string;
}

export class ParaBankApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async login(username: string, password: string): Promise<{ status: number; customer?: CustomerDto }> {
    const encodedUser = encodeURIComponent(username);
    const encodedPass = encodeURIComponent(password);
    const response = await this.request.get(`/parabank/services/bank/login/${encodedUser}/${encodedPass}`);
    if (!response.ok()) {
      return { status: response.status() };
    }
    const customer = (await response.json()) as CustomerDto;
    return { status: response.status(), customer };
  }

  async getCustomerAccounts(customerId: number): Promise<AccountDto[]> {
    const response = await this.request.get(`/parabank/services/bank/customers/${customerId}/accounts`);
    if (!response.ok()) {
      throw new Error(`GET customer accounts failed with ${response.status()}: ${await response.text()}`);
    }
    return (await response.json()) as AccountDto[];
  }

  async getAccount(accountId: string): Promise<AccountDto> {
    const response = await this.request.get(`/parabank/services/bank/accounts/${encodeURIComponent(accountId)}`);
    if (!response.ok()) {
      throw new Error(`GET account ${accountId} failed with ${response.status()}: ${await response.text()}`);
    }
    return (await response.json()) as AccountDto;
  }

  async getAccountBalanceInCents(accountId: string): Promise<number> {
    const account = await this.getAccount(accountId);
    return numberToCents(account.balance);
  }

  async getAccountTransactions(accountId: string): Promise<TransactionDto[]> {
    const response = await this.request.get(
      `/parabank/services/bank/accounts/${encodeURIComponent(accountId)}/transactions`,
    );
    if (!response.ok()) {
      throw new Error(`GET transactions for ${accountId} failed with ${response.status()}: ${await response.text()}`);
    }
    return (await response.json()) as TransactionDto[];
  }

  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: string,
  ): Promise<{ status: number; body: string }> {
    const response = await this.request.post('/parabank/services/bank/transfer', {
      params: {
        fromAccountId,
        toAccountId,
        amount,
      },
    });
    return { status: response.status(), body: await response.text() };
  }
}
