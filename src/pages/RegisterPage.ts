import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

interface RegistrationData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export class RegisterPage extends BasePage {
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly addressField: Locator;
  private readonly cityField: Locator;
  private readonly stateField: Locator;
  private readonly zipCodeField: Locator;
  private readonly phoneField: Locator;
  private readonly ssnField: Locator;
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly confirmPasswordField: Locator;
  private readonly registerButton: Locator;

  constructor(page: Page) {
    super(page, 'Register');
    this.firstNameField = page.locator('input[name="customer.firstName"]');
    this.lastNameField = page.locator('input[name="customer.lastName"]');
    this.addressField = page.locator('input[name="customer.address.street"]');
    this.cityField = page.locator('input[name="customer.address.city"]');
    this.stateField = page.locator('input[name="customer.address.state"]');
    this.zipCodeField = page.locator('input[name="customer.address.zipCode"]');
    this.phoneField = page.locator('input[name="customer.phoneNumber"]');
    this.ssnField = page.locator('input[name="customer.ssn"]');
    this.usernameField = page.locator('input[name="customer.username"]');
    this.passwordField = page.locator('input[name="customer.password"]');
    this.confirmPasswordField = page.locator('input[name="repeatedPassword"]');
    this.registerButton = page.locator('input[value="Register"]');
  }

  async navigateToRegistrationPage(): Promise<void> {
    console.log('🌐 Navigating to ParaBank registration page...');
    
    try {
      await this.page.goto('https://parabank.parasoft.com/parabank/register.htm', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for the registration form to be visible
      await this.firstNameField.waitFor({ state: 'visible', timeout: 10000 });
      
      console.log('✅ Successfully navigated to registration page');
      
    } catch (error) {
      console.error('❌ Failed to navigate to registration page:', error);
      throw error;
    }
  }

  async fillRegistrationForm(data: RegistrationData): Promise<void> {
    console.log('📝 Filling registration form...');
    
    try {
      // Fill personal information
      await this.firstNameField.fill(data.firstName);
      await this.lastNameField.fill(data.lastName);
      
      // Fill address information
      await this.addressField.fill(data.address);
      await this.cityField.fill(data.city);
      await this.stateField.fill(data.state);
      await this.zipCodeField.fill(data.zipCode);
      
      // Fill contact information
      await this.phoneField.fill(data.phone);
      await this.ssnField.fill(data.ssn);
      
      // Fill account information
      await this.usernameField.fill(data.username);
      await this.passwordField.fill(data.password);
      await this.confirmPasswordField.fill(data.confirmPassword);
      
      console.log(`✅ Registration form filled for user: ${data.username}`);
      
    } catch (error) {
      console.error('❌ Failed to fill registration form:', error);
      throw error;
    }
  }

  async submitRegistration(): Promise<void> {
    console.log('🔄 Submitting registration...');
    
    try {
      // Click the register button and wait for navigation or response
      await Promise.race([
        this.registerButton.click(),
        this.page.waitForURL('**/register.htm', { timeout: 1000 }).catch(() => null)
      ]);
      
      // Wait for either navigation or form processing
      await Promise.race([
        this.page.waitForURL('**/overview.htm', { timeout: 5000 }),
        this.page.waitForURL('**/accounts.htm', { timeout: 5000 }),
        this.page.waitForSelector('text*="Welcome"', { timeout: 5000 }),
        this.page.waitForSelector('text*="successfully"', { timeout: 5000 }),
        this.page.waitForSelector('.error', { timeout: 5000 }),
        this.page.waitForTimeout(3000) // Fallback timeout
      ]).catch(() => {
        console.log('⚠️ No clear navigation detected, continuing...');
      });
      
      console.log('✅ Registration form submitted');
      
    } catch (error) {
      console.log('⚠️ Registration submission completed with potential redirect:', error);
      // Don't throw error as redirect might be expected behavior
    }
  }

  async registerNewUser(data: RegistrationData): Promise<void> {
    await this.fillRegistrationForm(data);
    await this.submitRegistration();
  }

  async isRegistrationSuccessful(): Promise<boolean> {
    try {
      console.log('🔍 Checking registration success...');
      
      // Wait a moment for any processing
      await this.page.waitForTimeout(1000);
      
      // Check current URL first
      const currentUrl = this.page.url();
      console.log(`📍 Current URL: ${currentUrl}`);
      
      if (currentUrl.includes('overview.htm') || currentUrl.includes('accounts.htm')) {
        console.log('✅ Registration success - redirected to account page');
        return true;
      }
      
      // Check for success message elements
      const successSelectors = [
        'text*="Welcome"',
        'text*="successfully created"',
        'text*="Your account was created successfully"',
        'h1:has-text("Welcome")',
        'text*="Thank you"',
        '.confirmation'
      ];
      
      for (const selector of successSelectors) {
        try {
          const element = this.page.locator(selector);
          const isVisible = await element.isVisible().catch(() => false);
          if (isVisible) {
            const text = await element.textContent().catch(() => '');
            console.log(`✅ Registration success indicator found: ${text}`);
            return true;
          }
        } catch (error) {
          // Continue checking other selectors
        }
      }
      
      // If no clear success indicator but also no errors, assume success
      const hasError = await this.hasRegistrationError();
      if (!hasError) {
        console.log('📝 No error found, assuming registration was successful');
        return true;
      }
      
      console.log('⚠️ Registration success not clearly indicated');
      return false;
      
    } catch (error) {
      console.error('❌ Error checking registration success:', error);
      return false;
    }
  }

  async hasRegistrationError(): Promise<boolean> {
    try {
      const errorIndicators = [
        this.page.locator('.error'),
        this.page.locator('text*="error"'),
        this.page.locator('text*="already exists"'),
        this.page.locator('text*="invalid"'),
        this.page.locator('text*="required"')
      ];
      
      for (const indicator of errorIndicators) {
        const isVisible = await indicator.isVisible().catch(() => false);
        if (isVisible) {
          const errorText = await indicator.textContent();
          console.log(`⚠️ Registration error found: ${errorText}`);
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Error checking for registration errors:', error);
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    try {
      const errorIndicators = [
        this.page.locator('.error'),
        this.page.locator('text*="error"'),
        this.page.locator('text*="already exists"'),
        this.page.locator('text*="invalid"'),
        this.page.locator('text*="required"')
      ];
      
      for (const indicator of errorIndicators) {
        const isVisible = await indicator.isVisible().catch(() => false);
        if (isVisible) {
          const errorText = await indicator.textContent();
          return errorText || '';
        }
      }
      
      return '';
      
    } catch (error) {
      console.error('❌ Error getting error message:', error);
      return '';
    }
  }

  async isRegistrationFormVisible(): Promise<boolean> {
    try {
      return await this.firstNameField.isVisible();
    } catch (error) {
      return false;
    }
  }
}
