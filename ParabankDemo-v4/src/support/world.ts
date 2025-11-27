import { setWorldConstructor, setDefaultTimeout, World } from '@cucumber/cucumber';
import { chromium, firefox, webkit, type Browser, type BrowserContext, type Page } from '@playwright/test';

export interface V4WorldParameters {
  headless?: boolean;
  browser?: 'chromium' | 'firefox' | 'webkit';
}

export class V4World extends World<V4WorldParameters> {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  constructor(options: any) {
    super(options);
  }

  async initPage(): Promise<Page> {
    if (this.page) return this.page;

    const browserName = this.parameters.browser ?? 'chromium';
    const headless = this.parameters.headless ?? true;

    switch (browserName) {
      case 'firefox':
        this.browser = await firefox.launch({ headless });
        break;
      case 'webkit':
        this.browser = await webkit.launch({ headless });
        break;
      case 'chromium':
      default:
        this.browser = await chromium.launch({ headless });
        break;
    }

    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    return this.page;
  }

  async cleanup(): Promise<void> {
    await this.page?.close().catch(() => undefined);
    await this.context?.close().catch(() => undefined);
    await this.browser?.close().catch(() => undefined);
  }
}

// Temporarily lower Cucumber step timeout to 10s for faster feedback
setDefaultTimeout(10_000);
setWorldConstructor(V4World);
