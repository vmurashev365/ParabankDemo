/**
 * Base Page Object
 * Common functionality for all page objects
 * Based on Page Object Model design pattern
 */

import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../support/utils/Logger';
import { config } from '../support/config';

export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected baseURL: string;

  constructor(page: Page, pageName: string) {
    this.page = page;
    this.logger = new Logger(`${pageName}Page`);
    this.baseURL = config.baseURL;
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    this.logger.debug(`Waiting for element: ${selector}`);
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  /**
   * Click element with wait
   */
  async clickElement(selector: string): Promise<void> {
    this.logger.debug(`Clicking element: ${selector}`);
    const element = await this.waitForElement(selector);
    await element.click();
  }

  /**
   * Type text into element
   */
  async typeText(selector: string, text: string, clearFirst: boolean = true): Promise<void> {
    this.logger.debug(`Typing text into ${selector}: ${text}`);
    const element = await this.waitForElement(selector);
    
    if (clearFirst) {
      await element.clear();
    }
    
    await element.fill(text);
  }

  /**
   * Get text content from element
   */
  async getText(selector: string): Promise<string> {
    this.logger.debug(`Getting text from: ${selector}`);
    const element = await this.waitForElement(selector);
    const text = await element.textContent();
    return text || '';
  }

  /**
   * Get element attribute value
   */
  async getAttribute(selector: string, attribute: string): Promise<string> {
    this.logger.debug(`Getting ${attribute} attribute from: ${selector}`);
    const element = await this.waitForElement(selector);
    const value = await element.getAttribute(attribute);
    return value || '';
  }

  /**
   * Check if element exists and is visible
   */
  async isElementVisible(selector: string, timeout: number = 30000): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      return true;
    } catch (error) {
      this.logger.debug(`Element not visible: ${selector}`);
      return false;
    }
  }

  /**
   * Check if element exists (regardless of visibility)
   */
  async isElementPresent(selector: string): Promise<boolean> {
    const elements = await this.page.locator(selector).count();
    return elements > 0;
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    this.logger.debug('Waiting for page load');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to specific URL
   */
  async navigateTo(url: string): Promise<void> {
    this.logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Get current page URL
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for element to contain specific text
   */
  async waitForText(selector: string, expectedText: string, timeout: number = 10000): Promise<void> {
    this.logger.debug(`Waiting for text "${expectedText}" in element: ${selector}`);
    const element = this.page.locator(selector);
    await expect(element).toContainText(expectedText, { timeout });
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(selector: string): Promise<void> {
    this.logger.debug(`Scrolling element into view: ${selector}`);
    const element = await this.waitForElement(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Take screenshot of current page
   */
  async takeScreenshot(name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `reports/screenshots/${name}-${timestamp}.png`;
    
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    
    this.logger.info(`Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * Wait for URL to contain specific text
   */
  async waitForURLContains(text: string, timeout: number = 10000): Promise<void> {
    this.logger.debug(`Waiting for URL to contain: ${text}`);
    await this.page.waitForFunction(
      (expectedText: string) => window.location.href.includes(expectedText),
      text,
      { timeout }
    );
  }

  /**
   * Verify element text equals expected value
   */
  async verifyElementText(selector: string, expectedText: string): Promise<void> {
    this.logger.debug(`Verifying element text: ${selector} = "${expectedText}"`);
    const element = await this.waitForElement(selector);
    await expect(element).toHaveText(expectedText);
  }

  /**
   * Verify element contains expected text
   */
  async verifyElementContainsText(selector: string, expectedText: string): Promise<void> {
    this.logger.debug(`Verifying element contains text: ${selector} contains "${expectedText}"`);
    const element = await this.waitForElement(selector);
    await expect(element).toContainText(expectedText);
  }

  /**
   * Select option from dropdown
   */
  async selectFromDropdown(selector: string, optionValue: string): Promise<void> {
    this.logger.debug(`Selecting "${optionValue}" from dropdown: ${selector}`);
    const dropdown = await this.waitForElement(selector);
    await dropdown.selectOption({ value: optionValue });
  }

  /**
   * Handle alert dialog
   */
  async handleAlert(action: 'accept' | 'dismiss' = 'accept'): Promise<string> {
    return new Promise((resolve) => {
      this.page.on('dialog', async (dialog) => {
        const message = dialog.message();
        this.logger.debug(`Alert dialog: ${message} - Action: ${action}`);
        
        if (action === 'accept') {
          await dialog.accept();
        } else {
          await dialog.dismiss();
        }
        
        resolve(message);
      });
    });
  }
}
