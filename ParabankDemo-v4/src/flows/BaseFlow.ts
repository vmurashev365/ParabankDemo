import type { Page } from '@playwright/test';

export abstract class BaseFlow {
  constructor(protected page: Page) {}
}
