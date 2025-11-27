import type { Locator, Page } from '@playwright/test';

export abstract class BaseComponent {
  constructor(protected page: Page, protected root: Locator) {}

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }
}
