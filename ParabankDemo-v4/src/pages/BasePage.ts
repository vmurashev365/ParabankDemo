import type { Page } from '@playwright/test';

// Base URL should point to the server root (no trailing /parabank)
const DEFAULT_BASE_URL = 'http://127.0.0.1:8081';

function resolveBaseUrl(): string {
  // Prefer explicit v4 env, then fall back to shared v3-style BASE_URL
  const explicit = process.env.PARABANK_BASE_URL || process.env.BASE_URL;
  return explicit && explicit.trim().length > 0 ? explicit : DEFAULT_BASE_URL;
}

export abstract class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string): Promise<void> {
    const baseUrl = resolveBaseUrl().replace(/\/$/, '');
    const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    await this.page.goto(url);
  }
}
