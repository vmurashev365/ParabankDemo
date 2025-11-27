/**
 * Enhanced Cucumber World Configuration with Advanced Cloudflare Bypass
 */

import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { config, TestUser, getCurrentEnvironment } from './config';
import BrowserPoolManager from './BrowserPoolManager';

export interface CustomWorldOptions extends IWorldOptions {
  parameters: {
    headless?: boolean;
    slowMo?: number;
    browser?: string;
  };
}

class CustomWorld extends World {
  public browser: Browser | undefined;
  public context: BrowserContext | undefined;
  public page: Page | undefined;
  public secondPage: Page | undefined; // For multi-tab testing
  public currentUser: TestUser | undefined;
  public testStartTime: Date;
  public sessionId: string;
  private browserPool: BrowserPoolManager;

  constructor(options: CustomWorldOptions) {
    super(options);
    this.testStartTime = new Date();
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.browserPool = BrowserPoolManager.getInstance();
    
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      context: 'CustomWorld',
      message: 'Initializing Custom World',
      data: {
        environment: getCurrentEnvironment().name,
        browser: config.browser,
        headless: config.headless,
        sessionId: this.sessionId
      }
    }));
  }

  /**
   * Initialize browser with enhanced anti-detection
   */
  async initBrowser(): Promise<void> {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      context: 'CustomWorld',
      message: `Launching ${config.browser} browser with stealth configuration`,
      data: {
        headless: config.headless,
        slowMo: 300,
        sessionId: this.sessionId
      }
    }));

    // Get browser from pool with enhanced stealth
    this.browser = await this.browserPool.acquireBrowser(this.sessionId);

    // Create context with recording support
    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      locale: 'en-US',
      timezoneId: 'America/New_York',
      permissions: ['geolocation'],
      recordVideo: config.headless ? undefined : {
        dir: 'reports/videos/',
        size: { width: 1920, height: 1080 }
      }
    });

    this.page = await this.context.newPage();
    
    // Add MAXIMUM anti-detection scripts for ENHANCED Cloudflare bypass
    await this.page.addInitScript(() => {
      // Remove webdriver property completely
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
        configurable: true
      });

      // Mock comprehensive chrome runtime
      (window as any).chrome = {
        runtime: {
          onConnect: {},
          onMessage: {},
          connect: () => ({}),
          sendMessage: () => ({})
        },
        app: {
          isInstalled: false,
          InstallState: {
            DISABLED: 'disabled',
            INSTALLED: 'installed',
            NOT_INSTALLED: 'not_installed'
          },
          RunningState: {
            CANNOT_RUN: 'cannot_run',
            READY_TO_RUN: 'ready_to_run',
            RUNNING: 'running'
          }
        },
        csi: () => ({}),
        loadTimes: () => ({}),
        storage: {
          local: {
            get: () => ({}),
            set: () => ({})
          }
        }
      };
      
      // Override ALL automation-related properties
      delete (window as any).__nightmare;
      delete (window as any)._phantom;
      delete (window as any).phantom;
      delete (window as any).__fxdriver_evaluate;
      delete (window as any).__driver_evaluate;
      delete (window as any).__webdriver_evaluate;
      delete (window as any).__selenium_evaluate;
      delete (window as any).__fxdriver_unwrapped;
      delete (window as any).__driver_unwrapped;
      delete (window as any).__webdriver_unwrapped;
      delete (window as any).__selenium_unwrapped;
      delete (window as any).__webdriver_script_func;
      delete (window as any).__webdriver_script_fn;
      
      // Enhanced plugins simulation
      Object.defineProperty(navigator, 'plugins', {
        get: () => {
          const plugins = [
            { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
            { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
            { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' },
            { name: 'Microsoft Edge PDF Plugin', filename: 'edge-pdf-viewer', description: 'PDF Viewer' },
            { name: 'WebKit built-in PDF', filename: 'webkit-pdf-plugin', description: 'PDF Plugin' }
          ];
          return plugins;
        },
        configurable: true
      });
      
      // Enhanced language override
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
        configurable: true
      });
      
      // Platform consistency
      Object.defineProperty(navigator, 'platform', {
        get: () => 'Win32',
        configurable: true
      });
      
      // Hardware concurrency
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => 8,
        configurable: true
      });
      
      // MaxTouchPoints
      Object.defineProperty(navigator, 'maxTouchPoints', {
        get: () => 0,
        configurable: true
      });
      
      // Enhanced WebGL fingerprint protection
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37445) return 'Intel Inc.'; // UNMASKED_VENDOR_WEBGL
        if (parameter === 37446) return 'Intel(R) UHD Graphics 630'; // UNMASKED_RENDERER_WEBGL
        return getParameter.apply(this, arguments as any);
      };
      
      // Screen properties normalization
      Object.defineProperty(screen, 'width', { get: () => 1920, configurable: true });
      Object.defineProperty(screen, 'height', { get: () => 1080, configurable: true });
      Object.defineProperty(screen, 'colorDepth', { get: () => 24, configurable: true });
      Object.defineProperty(screen, 'pixelDepth', { get: () => 24, configurable: true });
    });
    
    // Set extended timeout for protection bypass
    this.page.setDefaultTimeout(60000); // 60 seconds instead of default
    
    // Human-like initial behavior
    await this.page.mouse.move(Math.random() * 200, Math.random() * 200);
    await this.page.waitForTimeout(500 + Math.random() * 500);

    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      context: 'CustomWorld',
      message: 'Browser initialized successfully with stealth configuration'
    }));
  }

  async navigateToParaBank(): Promise<void> {
    if (!this.page) {
      await this.initBrowser();
    }

    const environment = getCurrentEnvironment();
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      context: 'CustomWorld',
      message: 'Navigating to ParaBank',
      data: { url: environment.baseURL }
    }));

    await this.page!.goto(environment.baseURL, { waitUntil: 'networkidle' });
    
    // Wait for login panel to ensure page is loaded
    await this.page!.waitForSelector('#loginPanel', { timeout: 10000 });
  }

  setCurrentUser(user: TestUser): void {
    this.currentUser = user;
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      context: 'CustomWorld', 
      message: 'Set current user context',
      data: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }));
  }

  async takeScreenshot(name: string): Promise<string | undefined> {
    if (!this.page) {
      return undefined;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `reports/screenshots/${name}-${timestamp}.png`;
    
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      context: 'CustomWorld',
      message: 'Screenshot captured',
      data: { path: screenshotPath }
    }));
    return screenshotPath;
  }

  async waitForElement(selector: string, timeout: number = 30000): Promise<void> {
    if (!this.page) {
      throw new Error('Page is not available');
    }

    await this.page.waitForSelector(selector, {
      state: 'visible',
      timeout
    });
  }

  getTestDuration(): number {
    return Date.now() - this.testStartTime.getTime();
  }

  async releaseBrowserFromPool(): Promise<void> {
    if (this.browser && this.browserPool) {
      await this.browserPool.releaseBrowser(this.sessionId);
      this.browser = undefined;
      this.context = undefined;
      this.page = undefined;
    }
  }

  /**
   * Close browser and cleanup resources
   */
  async closeBrowser(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = undefined;
    }

    // Release browser back to pool instead of closing directly
    if (this.browser) {
      await this.browserPool.releaseBrowser(this.sessionId);
      this.browser = undefined;
    }

    this.page = undefined;
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      context: 'CustomWorld',
      message: 'Browser closed and cleaned up',
      data: { sessionId: this.sessionId }
    }));
  }

  /**
   * Extract test ID from scenario name
   */
  extractTestId(scenarioName: string): string {
    const match = scenarioName.match(/TC_(\d+)/);
    return match ? `TC_${match[1]}` : 'UNKNOWN';
  }
}

// Export CustomWorld class before setting it as constructor
export { CustomWorld };

// Set as world constructor
setWorldConstructor(CustomWorld);
