/**
 * Test Configuration
 * Based on TPS-PARABANK-001 Test Plan Specification
 */

import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export interface TestConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  slowMo: number;
  screenshot: 'off' | 'only-on-failure' | 'on';
  video: 'off' | 'on-first-retry' | 'retain-on-failure' | 'on';
}

export interface TestUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  accountBalance?: number;
  accountType?: 'checking' | 'savings' | 'loan';
}

export interface TestEnvironment {
  name: 'development' | 'testing' | 'staging';
  baseURL: string;
  apiURL: string;
  database: {
    host: string;
    name: string;
  };
}

export const config: TestConfig = {
  baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com/parabank',
  timeout: parseInt(process.env.TEST_TIMEOUT || '30000'),
  retries: parseInt(process.env.RETRIES || '1'),
  browser: (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium',
  headless: process.env.HEADLESS !== 'false',
  slowMo: parseInt(process.env.SLOW_MO || '0'),
  screenshot: (process.env.SCREENSHOT as 'off' | 'only-on-failure' | 'on') || 'only-on-failure',
  video: (process.env.VIDEO as 'off' | 'on-first-retry' | 'retain-on-failure' | 'on') || 'retain-on-failure'
};

export const environments: Record<string, TestEnvironment> = {
  development: {
    name: 'development',
    baseURL: 'http://localhost:8080/parabank',
    apiURL: 'http://localhost:8080/parabank/services',
    database: {
      host: 'localhost',
      name: 'parabank_dev'
    }
  },
  testing: {
    name: 'testing',
    baseURL: 'https://parabank.parasoft.com/parabank',
    apiURL: 'https://parabank.parasoft.com/parabank/services',
    database: {
      host: 'test-db-server',
      name: 'parabank_test'
    }
  },
  staging: {
    name: 'staging',
    baseURL: 'https://staging.parabank.com/parabank',
    apiURL: 'https://staging.parabank.com/parabank/services',
    database: {
      host: 'staging-db-server', 
      name: 'parabank_staging'
    }
  }
};

export const getCurrentEnvironment = (): TestEnvironment => {
  const envName = process.env.TEST_ENV || 'testing';
  return environments[envName] || environments.testing;
};
