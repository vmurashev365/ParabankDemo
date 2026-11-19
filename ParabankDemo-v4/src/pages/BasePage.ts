import type { Page } from '@playwright/test';
import { resolveBaseUrl } from '../support/env';

export abstract class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string): Promise<void> {
    const baseUrl = resolveBaseUrl();
    const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    await this.page.goto(url);
  }
}
