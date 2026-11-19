import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import {
  chromium,
  firefox,
  request,
  webkit,
  type APIRequestContext,
  type Browser,
  type BrowserContext,
  type Page,
} from '@playwright/test';
import { ParaBankApiClient, type CustomerDto } from '../api/ParaBankApiClient';
import { NavbarComponent } from '../components/NavbarComponent';
import { AccountsPage } from '../pages/AccountsPage';
import { BillPayPage } from '../pages/BillPayPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TransferPage } from '../pages/TransferPage';
import { resolveBaseUrl } from './env';

interface BrowserSettings {
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
}

const BROWSER_TYPES = { chromium, firefox, webkit } as const;

let sharedBrowser: Browser | undefined;

async function acquireSharedBrowser(settings: BrowserSettings): Promise<Browser> {
  if (sharedBrowser && sharedBrowser.isConnected()) {
    return sharedBrowser;
  }
  const browserType = BROWSER_TYPES[settings.browser];
  if (!browserType) {
    throw new Error(`Unknown PARABANK_BROWSER: ${settings.browser}`);
  }
  sharedBrowser = await browserType.launch({ headless: settings.headless });
  return sharedBrowser;
}

export async function closeSharedBrowser(): Promise<void> {
  if (sharedBrowser) {
    const browser = sharedBrowser;
    sharedBrowser = undefined;
    await browser.close();
  }
}

function sanitizeTraceName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'scenario'
  );
}

export class V4World extends World<BrowserSettings> {
  private context?: BrowserContext;
  private apiContext?: APIRequestContext;
  private tracingActive = false;

  page!: Page;
  api!: ParaBankApiClient;

  accounts!: AccountsPage;
  billPay!: BillPayPage;
  login!: LoginPage;
  registration!: RegisterPage;
  transfer!: TransferPage;
  navbar!: NavbarComponent;

  balancesBefore = new Map<string, number>();
  balancesAfter = new Map<string, number>();
  payment?: { payee: string; amount: string; fromAccount: string };
  lastApiStatus?: number;
  lastApiCustomer?: CustomerDto;

  async initApi(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: resolveBaseUrl(),
      extraHTTPHeaders: { Accept: 'application/json' },
    });
    this.api = new ParaBankApiClient(this.apiContext);
  }

  async initBrowser(): Promise<void> {
    const browser = await acquireSharedBrowser(this.parameters);
    this.context = await browser.newContext();
    await this.context.tracing.start({ screenshots: true, snapshots: true });
    this.tracingActive = true;
    this.page = await this.context.newPage();
    this.accounts = new AccountsPage(this.page);
    this.billPay = new BillPayPage(this.page);
    this.login = new LoginPage(this.page);
    this.registration = new RegisterPage(this.page);
    this.transfer = new TransferPage(this.page);
    this.navbar = NavbarComponent.create(this.page);
  }

  async cleanup(failed: boolean, scenarioName: string): Promise<void> {
    try {
      if (this.context) {
        if (this.tracingActive) {
          if (failed) {
            const tracesDir = join(process.cwd(), 'reports', 'traces');
            mkdirSync(tracesDir, { recursive: true });
            const tracePath = join(tracesDir, `${sanitizeTraceName(scenarioName)}-${Date.now()}.zip`);
            await this.context.tracing.stop({ path: tracePath });
            await this.attach(`Playwright trace saved to ${tracePath}`, 'text/plain');
          } else {
            await this.context.tracing.stop();
          }
          this.tracingActive = false;
        }
        await this.context.close();
        this.context = undefined;
      }
    } finally {
      if (this.apiContext) {
        await this.apiContext.dispose();
        this.apiContext = undefined;
      }
    }
  }
}

setWorldConstructor(V4World);
setDefaultTimeout(30_000);
