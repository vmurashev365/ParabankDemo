import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class ErrorBannerComponent extends BaseComponent {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  private get errorText(): Locator {
    return this.root.getByRole('alert');
  }

  async getErrorText(): Promise<string> {
    return this.errorText.innerText();
  }
}
