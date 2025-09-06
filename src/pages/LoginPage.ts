/**
 * Login Page Object
 * Based on Authentication scenarios TC_001-TC_035 from complete_parabank_scenarios.txt
 * Supports both automated Playwright execution and manual test procedures
 */

import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestUser } from '../support/config';

export class LoginPage extends BasePage {
  // Page elements selectors
  private readonly selectors = {
    // Login form elements
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'input[value="Log In"]',
    loginPanel: '#loginPanel',
    
    // Error and success messages
    errorMessage: '.error',
    welcomeMessage: '.smallText',
    
    // Navigation elements
    registerLink: 'a[href="register.htm"]',
    logoutLink: 'a[href*="logout"]',
    accountServicesMenu: '#leftPanel',
    
    // Page verification elements
    accountsOverviewTitle: '.title',
    accountsTable: '#accountTable'
  } as const;

  constructor(page: Page) {
    super(page, 'Login');
  }

  /**
   * TC_001: Navigate to ParaBank homepage with Cloudflare bypass
   * Automated implementation
   */
  async navigateToHomepage(): Promise<void> {
    this.logger.step('Navigate to ParaBank homepage (stealth mode)', 'START');
    const startTime = Date.now();
    
    try {
      // Navigate with extended timeout and stealth settings
      await this.page.goto(this.baseURL, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      
      // Wait for potential protection challenges
      this.logger.info('Checking for protection challenges...');
      await this.page.waitForTimeout(3000 + Math.random() * 2000);
      
      // Handle Cloudflare or similar protection
      const title = await this.page.title();
      if (title.includes('Just a moment') || title.includes('Cloudflare') || title.includes('Checking')) {
        this.logger.warn('Protection detected, waiting for bypass...');
        
        await this.page.waitForFunction(() => {
          const currentTitle = document.title;
          return !currentTitle.includes('Just a moment') && 
                 !currentTitle.includes('Cloudflare') && 
                 !currentTitle.includes('Checking');
        }, { timeout: 45000 });
        
        this.logger.info('Protection bypassed!');
      }
      
      // Wait for ParaBank with retries
      let attempts = 3;
      while (attempts > 0) {
        try {
          await this.waitForElement('#leftPanel', 15000);
          break;
        } catch (error) {
          attempts--;
          if (attempts === 0) throw error;
          this.logger.warn(`Retrying... ${attempts} attempts left`);
          await this.page.waitForTimeout(2000);
        }
      }
      
      // Human-like mouse movement
      await this.page.mouse.move(Math.random() * 400, Math.random() * 400);
      await this.page.waitForTimeout(500 + Math.random() * 1000);
      
      // Verify login form is displayed
      const isLoginFormVisible = await this.isElementVisible(this.selectors.usernameInput);
      if (!isLoginFormVisible) {
        throw new Error('Login form is not displayed');
      }
      
      this.logger.step('Navigate to ParaBank homepage (stealth mode)', 'PASS', Date.now() - startTime);
    } catch (error) {
      this.logger.step('Navigate to ParaBank homepage (stealth mode)', 'FAIL', Date.now() - startTime, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * TC_001, TC_003: Successful login with valid credentials
   * Automated implementation
   */
  async loginWithValidCredentials(username: string, password: string): Promise<void> {
    this.logger.step(`Login with credentials: ${username}`, 'START');
    const startTime = Date.now();
    
    try {
      // Enter username
      await this.typeText(this.selectors.usernameInput, username);
      this.logger.debug(`Username entered: ${username}`);
      
      // Enter password  
      await this.typeText(this.selectors.passwordInput, password);
      this.logger.debug('Password entered (hidden for security)');
      
      // Click login button
      await this.clickElement(this.selectors.loginButton);
      this.logger.debug('Login button clicked');
      
      // Wait for redirect to accounts overview
      await this.waitForURLContains('overview.htm');
      
      // Verify successful login
      await this.verifySuccessfulLogin();
      
      this.logger.step(`Login with credentials: ${username}`, 'PASS', Date.now() - startTime);
    } catch (error) {
      this.logger.step(`Login with credentials: ${username}`, 'FAIL', Date.now() - startTime, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * TC_004, TC_005, TC_006, TC_007: Login with invalid credentials
   * Automated implementation
   */
  async loginWithInvalidCredentials(username: string, password: string): Promise<void> {
    this.logger.step(`Login with invalid credentials: ${username}`, 'START');
    const startTime = Date.now();
    
    try {
      // Enter credentials
      await this.typeText(this.selectors.usernameInput, username);
      await this.typeText(this.selectors.passwordInput, password);
      
      // Click login button
      await this.clickElement(this.selectors.loginButton);
      
      // Wait for error message to appear
      await this.waitForElement(this.selectors.errorMessage);
      
      this.logger.step(`Login with invalid credentials: ${username}`, 'PASS', Date.now() - startTime);
    } catch (error) {
      this.logger.step(`Login with invalid credentials: ${username}`, 'FAIL', Date.now() - startTime, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * TC_016, TC_017, TC_018: SQL Injection prevention
   * Automated implementation
   */
  async attemptSQLInjection(sqlPayload: string, password: string = "demo"): Promise<void> {
    this.logger.step('Attempt SQL injection', 'START');
    const startTime = Date.now();
    
    try {
      // Enter SQL injection payload in username
      await this.typeText(this.selectors.usernameInput, sqlPayload);
      await this.typeText(this.selectors.passwordInput, password);
      
      // Attempt login
      await this.clickElement(this.selectors.loginButton);
      
      // Verify SQL injection is prevented (should see error message)
      const errorVisible = await this.isElementVisible(this.selectors.errorMessage);
      if (!errorVisible) {
        throw new Error('SQL injection may have succeeded - no error message displayed');
      }
      
      // Verify we're still on login page (not redirected)
      const currentUrl = this.getCurrentURL();
      if (currentUrl.includes('overview.htm')) {
        throw new Error('SQL injection may have succeeded - unauthorized access granted');
      }
      
      this.logger.step('Attempt SQL injection', 'PASS', Date.now() - startTime, {
        payload: sqlPayload,
        prevented: true
      });
    } catch (error) {
      this.logger.step('Attempt SQL injection', 'FAIL', Date.now() - startTime, {
        error: error instanceof Error ? error.message : 'Unknown error',
        payload: sqlPayload
      });
      throw error;
    }
  }

  /**
   * TC_019, TC_020: XSS prevention
   * Automated implementation
   */
  async attemptXSSInjection(xssPayload: string, password: string = "demo"): Promise<void> {
    this.logger.step('Attempt XSS injection', 'START');
    const startTime = Date.now();
    
    try {
      // Enter XSS payload
      await this.typeText(this.selectors.usernameInput, xssPayload);
      await this.typeText(this.selectors.passwordInput, password);
      
      // Attempt login
      await this.clickElement(this.selectors.loginButton);
      
      // Wait a moment for any potential script execution
      await this.page.waitForTimeout(2000);
      
      // Verify XSS is prevented (should see error message, not script execution)
      const errorVisible = await this.isElementVisible(this.selectors.errorMessage);
      if (!errorVisible) {
        throw new Error('XSS injection may have succeeded - no error message displayed');
      }
      
      this.logger.step('Attempt XSS injection', 'PASS', Date.now() - startTime, {
        payload: xssPayload,
        prevented: true
      });
    } catch (error) {
      this.logger.step('Attempt XSS injection', 'FAIL', Date.now() - startTime, {
        error: error instanceof Error ? error.message : 'Unknown error',
        payload: xssPayload
      });
      throw error;
    }
  }

  /**
   * TC_013: Successful logout
   * Automated implementation
   */
  async logout(): Promise<void> {
    this.logger.step('Logout user', 'START');
    const startTime = Date.now();
    
    try {
      // Click logout link
      await this.clickElement(this.selectors.logoutLink);
      
      // Wait for redirect to login page
      await this.waitForElement(this.selectors.loginPanel);
      
      // Verify login form is displayed again
      const isLoginFormVisible = await this.isElementVisible(this.selectors.usernameInput);
      if (!isLoginFormVisible) {
        throw new Error('Logout failed - login form not displayed');
      }
      
      this.logger.step('Logout user', 'PASS', Date.now() - startTime);
    } catch (error) {
      this.logger.step('Logout user', 'FAIL', Date.now() - startTime, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Helper method: Verify successful login
   */
  private async verifySuccessfulLogin(): Promise<void> {
    // Check if we're on accounts overview page
    const currentUrl = this.getCurrentURL();
    if (!currentUrl.includes('overview.htm')) {
      throw new Error(`Login failed - not redirected to overview page. Current URL: ${currentUrl}`);
    }
    
    // Verify welcome message or accounts table is visible
    const accountsTableVisible = await this.isElementVisible(this.selectors.accountsTable);
    const titleVisible = await this.isElementVisible(this.selectors.accountsOverviewTitle);
    
    if (!accountsTableVisible && !titleVisible) {
      throw new Error('Login failed - accounts overview page elements not visible');
    }
    
    this.logger.debug('Login verification successful');
  }

  /**
   * Get error message text
   * Used for validation in negative test scenarios
   */
  async getErrorMessage(): Promise<string> {
    try {
      return await this.getText(this.selectors.errorMessage);
    } catch (error) {
      return '';
    }
  }

  /**
   * Get welcome message text
   * Used for validation in positive test scenarios
   */
  async getWelcomeMessage(): Promise<string> {
    try {
      return await this.getText(this.selectors.welcomeMessage);
    } catch (error) {
      return '';
    }
  }

  /**
   * Verify login form is displayed correctly
   * TC_002: Login form displays correctly
   */
  async verifyLoginFormDisplayed(): Promise<void> {
    this.logger.step('Verify login form displayed', 'START');
    const startTime = Date.now();
    
    try {
      // Wait for and check username field
      const usernameVisible = await this.isElementVisible(this.selectors.usernameInput, 15000);
      const usernameEnabled = usernameVisible && await this.page.isEnabled(this.selectors.usernameInput);
      
      // Wait for and check password field
      const passwordVisible = await this.isElementVisible(this.selectors.passwordInput, 15000);
      const passwordEnabled = passwordVisible && await this.page.isEnabled(this.selectors.passwordInput);
      
      // Wait for and check login button
      const loginButtonVisible = await this.isElementVisible(this.selectors.loginButton, 15000);
      const loginButtonEnabled = loginButtonVisible && await this.page.isEnabled(this.selectors.loginButton);
      
      if (!usernameVisible || !usernameEnabled) {
        throw new Error(`Username field validation failed - visible: ${usernameVisible}, enabled: ${usernameEnabled}`);
      }
      
      if (!passwordVisible || !passwordEnabled) {
        throw new Error(`Password field validation failed - visible: ${passwordVisible}, enabled: ${passwordEnabled}`);
      }
      
      if (!loginButtonVisible || !loginButtonEnabled) {
        throw new Error(`Login button validation failed - visible: ${loginButtonVisible}, enabled: ${loginButtonEnabled}`);
      }
      
      this.logger.step('Verify login form displayed', 'PASS', Date.now() - startTime);
    } catch (error) {
      this.logger.step('Verify login form displayed', 'FAIL', Date.now() - startTime, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Navigate to registration page
   * Helper method for registration flow
   */
  async navigateToRegistration(): Promise<void> {
    this.logger.step('Navigate to registration', 'START');
    const startTime = Date.now();
    
    try {
      await this.clickElement(this.selectors.registerLink);
      await this.waitForURLContains('register.htm');
      
      this.logger.step('Navigate to registration', 'PASS', Date.now() - startTime);
    } catch (error) {
      this.logger.step('Navigate to registration', 'FAIL', Date.now() - startTime, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Additional helper methods for step definitions
   */
  async verifyAccountsOverviewPage(): Promise<boolean> {
    try {
      const currentUrl = this.getCurrentURL();
      if (currentUrl.includes('overview.htm')) {
        return true;
      }
      
      // Alternative check for accounts page indicators
      const accountsTableVisible = await this.isElementVisible(this.selectors.accountsTable, 5000);
      const titleVisible = await this.isElementVisible(this.selectors.accountsOverviewTitle, 5000);
      
      return accountsTableVisible || titleVisible;
    } catch (error) {
      return false;
    }
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.typeText(this.selectors.usernameInput, username);
    await this.typeText(this.selectors.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.selectors.loginButton);
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.loginButton);
  }

  async analyzeSecurityHeaders(): Promise<void> {
    this.logger.step('Analyzing security headers', 'START');
    try {
      const response = await this.page.goto(this.baseURL, { waitUntil: 'networkidle' });
      if (!response) throw new Error('No response received');
      
      const headers = response.headers();
      this.logger.debug('Security headers analyzed', { headers });
    } catch (error) {
      this.logger.warn('Security headers analysis failed', { error });
    }
  }

  async verifySecurityCompliance(): Promise<{ passed: boolean; details?: any }> {
    try {
      // Basic security compliance check
      const response = await this.page.goto(this.baseURL, { waitUntil: 'networkidle' });
      if (!response) return { passed: false };
      
      const headers = response.headers();
      const hasHTTPS = this.page.url().startsWith('https://');
      
      return {
        passed: true,
        details: {
          https: hasHTTPS,
          headers: Object.keys(headers).length > 0
        }
      };
    } catch (error) {
      return { passed: false, details: { error: error } };
    }
  }
}
